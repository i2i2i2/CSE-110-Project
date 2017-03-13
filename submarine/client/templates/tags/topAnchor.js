Template.TopAnchor.onCreated(function() {
  var self = this;

  // helper variable for drag
  self.mouseDownY = -1;
  self.lastPointY = -1;
  self.mousemoveTime = -1;
  self.velocity = -1;
  self.moved = false;
  self.windowHeight = $(window).height();
  self.isRefreshing = new ReactiveVar(false);
  self.refreshCount = new ReactiveVar(1);

  self.handleTouchDown = function(event) {

    var touch = event.touches.item(0);
    if(!$.contains(document.getElementsByClassName("submarine_bg")[0],event.target))
      return;

    self.lastPointY = self.mouseDownY = event.touches.item(0).pageY;
    self.mousemoveTime = Date.now().value;
    self.velocity = 0;
    self.moved = false;

    $(".top_anchor").addClass("drag");
    $("body > .content").addClass("drag");
    document.addEventListener('touchmove', self.handleTouchMove);
  }

  self.handleTouchUp = function(event) {
    if (!self.moved) return;

    $(".top_anchor").addClass("transition");
    setTimeout(function() {
      $(".top_anchor").removeClass("transition");
    }, 500);

    self.moved = false;
    document.removeEventListener('touchmove', self.handleTouchMove);
    $(".drag").removeClass("drag");
    $('.top_anchor').removeAttr('style');

    if (Math.abs(self.mouseDownY - self.lastPointY) > 200 || self.velocity > 1) {
      if ($(".top_anchor").hasClass("top")) {
        $("body > .content").css({"filter": "blur(30px)"});
        if (Meteor.isCordova)
          App.Utils.WifiWizard.getNearbyWifi(self.resubscribe);
      }
      else{
        $("body > .content").removeAttr('style');
      }
      $('.top_anchor').toggleClass('top').toggleClass('bottom');

    } else {
      if ($(".top_anchor").hasClass("bottom")) {
        $("body > .content").css({"filter": "blur(30px)"});
      }
      else{
        $("body > .content").removeAttr('style');
      }
    }
  }

  self.handleTouchMove = function(event) {
    self.moved = true;
    var now = Date.now();
    var pageY = event.touches.item(0).pageY;
    self.velocity = Math.abs((pageY - self.lastPointY)/(now - self.mousemoveTime));
    self.lastPointY = pageY;
    self.mousemoveTime = now;
    var diff = self.lastPointY - self.mouseDownY;
    if ($(".top_anchor").hasClass("top")) {
      if (diff < 0) diff = 0;
      if (diff > self.windowHeight) diff = self.windowHeight;
      self.$(".top_anchor").css("bottom", "calc(100vh - " + diff + "px)");
      var blur_px = 0.04*diff;
      $("body > .content").css({"filter": "blur(" + blur_px + "px)"});
    } else {
      if (diff > 0) diff = 0;
      if (diff < -self.windowHeight) diff = -self.windowHeight;
      self.$(".top_anchor").css("bottom", -diff + "px");
      var blur_px = 0.04*(self.windowHeight + diff);
      $("body > .content").css({"filter": "blur(" + blur_px + "px)"});
    }
  }

  self.displayError = function(DOM_element, errMsg) {
    console.log(errMsg);
    if (errMsg == "No Days Selected") {
      $(".check").fadeOut(400).fadeIn(400).fadeOut(400).fadeIn(400);
      return;
    }

    if (errMsg == "time not included") {
      var isLeft = DOM_element.parent().find(".time").hasClass("right");
      DOM_element.parent().append('<div class="ontime error' + (isLeft? " left": "") +'"><i class="fa fa-minus-circle"></i>Current Time Must</div>');
      DOM_element = $("#duration_slide");
      var isLeft = DOM_element.parent().find(".time").hasClass("right");
      DOM_element.parent().append('<div class="ontime error' + (isLeft? " left": "") +'">Be included in Range</div>');

    } else if (errMsg == "repeat not included") {
      var isLeft = DOM_element.parent().find(".time").hasClass("right");
      DOM_element.parent().append('<div class="ontime error' + (isLeft? " left": "") +'"><i class="fa fa-minus-circle"></i>Today Must Be</div>');
      DOM_element = $("#duration_slide");
      var isLeft = DOM_element.parent().find(".time").hasClass("right");
      DOM_element.parent().append('<div class="ontime error' + (isLeft? " left": "") +'">Included in Repeat</div>');

    } else {
      DOM_element = DOM_element.parent();
      DOM_element.append('<div class="error"><i class="fa fa-minus-circle"></i>' + errMsg + '</div>');
    }

    $(".item_wrapper .error").fadeOut(400).fadeIn(400).fadeOut(400).fadeIn(400).fadeOut(400);
    setTimeout(function() {
      $(".item_wrapper .error").remove();
    }, 2000);
  };

  if (Meteor.isCordova)
    App.Utils.WifiWizard.getNearbyWifi(self.resubscribe);

  self.refreshNearbyTags = (function() {
    var self = this;
    var wifis = App.Collections.Wifis.find().fetch();
    if (!wifis.length) return;

    var tagIds = [];
    wifis.forEach((wifi) => {
      tagIds = tagIds.concat(wifi.tags);
    });

    self.isRefreshing.set(true);

    Meteor.call("tags/getTagsById", tagIds, function(err, res) {
      console.log("refresh tags");
      if (err) return;
      var tagList = res;

      var wifiList = Session.get("wifiList");
      if (!wifiList || !wifiList.length) return false;

      // turn wifi into dictionary
      wifiDict = {};
      wifiList.forEach(wifi => {
        wifiDict[wifi.bssid] = wifi.level;
      });

      // filter out tag not in time range
      var mmt = moment();
      // Your moment at midnight
      var mmtMidnight = mmt.clone().startOf('day');
      // Difference in minutes
      var diff = mmt.diff(mmtMidnight, 'minutes');
      tagList = tagList.filter((tag) => {
        // filter by wifi
        if (!tag.wifis || !tag.wifis.length) return false;

        // filter by weekday
        var day = 7 - (new Date()).getDay();
        var repeat = tag.repeat.toString(2);
        if (repeat.length < day || repeat.charAt(repeat.length - day) == "0")
          return false;

        // filter by time
        var start = tag.startTime;
        var end = (tag.startTime + tag.duration) % 1440;
        if (end <= start) {
          return diff > start || diff < end;
        } else {
          return diff > start && diff < end;
        }
      })

      // calc std of dist of each tag in wifi network + add index
      tagList.forEach((tag, index) => {
        tag.index = index;
        tag.std = 0;
        tag.wifis.forEach((wifi) => {
          var level1 = wifi.level;
          var level2 = wifiDict[wifi.wifiId] ? wifiDict[wifi.wifiId]: -100;
          tag.std += (level1 - level2) * (level1 - level2);
        });
        tag.std /= tag.wifis.length;
      });

      // sort by std in distance
      tagList.sort(function(tag1, tag2) {
        return tag1.std - tag2.std;
      })

      // record length for checkRenderDone
      self.tagCount = tagList.length;

      console.log(tagList.length);
      Session.set("nearbyTags", tagList);
      self.refreshCount.set(self.refreshCount.get() + 1);
    });
  }).bind(self);

  self.resubscribe = (function(wifiList) {
    var self = this;
    console.log("refresh wifiList");

    if (wifiList && wifiList.length) {
      if (self.subHandle) self.subHandle.stop();

      self.subHandle = Meteor.subscribe("wifis/nearbyWifis", wifiList, function() {
        self.refreshNearbyTags();
      });
    }
  }).bind(self);

  self.autorun(function() {
    self.observeWifiChange = App.Collections.Wifis.find().observeChanges({
      changed: function(id, fields) {
        if (self.changeTimeOut) {
          clearTimeout(self.changeTimeOut);
        }
        self.changeTimeOut = setTimeout(function() {
          self.refreshNearbyTags();
        }, 50);
      }
    });
  })
});

Template.TopAnchor.onRendered(function() {
  document.addEventListener('touchstart', this.handleTouchDown);
  document.addEventListener('touchend', this.handleTouchUp);

  $("#start_slide")[0].addEventListener("input", function (event) {
    var read = 15 * $(event.currentTarget).val();
    var time = moment("1970-01-01").add(read, "minutes").format("HH:mm");
    $("#start_time").text(time);
    if (read < 720 && !$("#start_time").hasClass("right")) {
      $("#start_time").fadeOut(50);

      setTimeout(function() {
        $("#start_time").addClass("right").fadeIn();
      }, 50);
    } else if (read >= 720 && $("#start_time").hasClass("right")) {
      $("#start_time").fadeOut(50);

      setTimeout(function() {
        $("#start_time").removeClass("right").fadeIn();
      }, 50);
    }
  });
  $("#duration_slide")[0].addEventListener("input", function (event) {
    var read = $(event.currentTarget).val();
    if (read <= 48) {
      var time = moment("1970-01-01").add(5 * read, "minutes").format("HH:mm");
    } else {
      var time = moment("1970-01-01").add(read * 0.5 - 20, "hours").format("HH:mm");
      if (time == "00:00") time = "24:00";
    }
    $("#duration_time").text(time);
    if (read < 44 && !$("#duration_time").hasClass("right")) {
      $("#duration_time").fadeOut(50);

      setTimeout(function() {
        $("#duration_time").addClass("right").fadeIn();
      }, 50);
    } else if (read >= 44 && $("#duration_time").hasClass("right")) {
      $("#duration_time").fadeOut(50);

      setTimeout(function() {
        $("#duration_time").removeClass("right").fadeIn();
      }, 50);
    }
  });
});

Template.TopAnchor.onDestroyed(function() {
  document.removeEventListener('touchstart', this.handleTouchDown);
  document.removeEventListener('touchend', this.handleTouchUp);
});

Template.TopAnchor.events({

  "click .create.button": function(e, t) {
    if (Template.instance().creating) return;

    $(".button_wrapper").toggleClass("hide");
    $(".tagContent").toggleClass("small");
    $(".create.button > .fa").fadeOut(100);
    setTimeout(function() {
      $(".create.button > .fa").toggleClass("fa-plus").toggleClass("fa-minus").fadeIn(100);
    }, 100);
  },

  "click .tag_avatar, click .tag_duration, click .tag_repeat, click .tag_description": function (e, t) {
     var idNumber = t.$(e.currentTarget).data('tagId');
      if (!t.moved) {
          t.$('.top_anchor').toggleClass('top').toggleClass('bottom');
          $('.drag').removeClass("drag");
          if ($(".top_anchor").hasClass("bottom")) {
              $("body > .content").css({"filter": "blur(30px)",});
          }
          else {
              $("body > .content").removeAttr("style");
          }
      }
     FlowRouter.go('/chats/tag/'+idNumber);
  },

  "click .check": function(e, t) {
    if ($(e.currentTarget).hasClass("all")) {
      if ($(e.currentTarget).hasClass("selected"))
        $(".check").removeClass("selected");
      else {
        $(".check").addClass("selected");
      }
      return;
    }
    $(e.currentTarget).toggleClass("selected");
  },

  "click .submit.button": function(e, t) {
    var self = Template.instance();
    if (self.creating) return;

    console.log("clicked");

    var newTag = {};
    // get name
    newTag.name = $("input[name=chatroom_name]").val();
    if (!newTag.name) {
      self.displayError($("input[name=chatroom_name]"), "Needed");
      return;
    }
    // get description
    newTag.description = $("input[name=room_discription]").val();
    if (!newTag.description) {
      self.displayError($("input[name=room_discription]"), "Needed");
      return;
    }
    // get time
    newTag.startTime = $("#start_slide").val() * 15;
    var durationRead = $("#duration_slide").val();
    newTag.duration = durationRead <= 48 ? durationRead * 5 : durationRead * 30 - 1200;
    // get repeat
    var repeat = 0;
    $(".check.selected").toArray().forEach(function(element) {
      repeat += $(element).data("val");
    });
    if (repeat == 0) {
      self.displayError($(".repeat_wrapper"), "No Days Selected");
      return;
    }
    newTag.repeat = repeat;
    newTag.activeUser = [];
    newTag.users = [];

    // check if current time is included
    var mmt = moment();
    var mmtMidnight = mmt.clone().startOf('day');
    var diff = mmt.diff(mmtMidnight, 'minutes');
    // filter by weekday
    var day = 7 - (new Date()).getDay();
    repeat = newTag.repeat.toString(2);
    if (repeat.length < day || repeat.charAt(repeat.length - day) == "0") {
      self.displayError($("#start_slide"), "repeat not included");
      return;
    }

    // filter by time
    var start = newTag.startTime;
    var end = (newTag.startTime + newTag.duration) % 1440;
    if (end <= start) {
      if (diff < start && diff > end) {
        self.displayError($("#start_slide"), "time not included");
        return;
      }
    } else {
      if (diff < start || diff > end) {
        self.displayError($("#start_slide"), "time not included");
        return;
      }
    }

    var createNewTag = (function(newTag, self, wifiList) {

      wifiList = wifiList.slice(0, wifiList.length >= 5? 5: wifiList.length);

      Meteor.call("tags/createTag", newTag, wifiList, (err, res) => {
        if (err) {
          console.log(JSON.stringify(err, undefined, 2));
          self.$(".button.submit > .fa, .button.create > .fa-refresh").remove();
          self.displayError($("input[name=chatroom_name]"), "Name Existed");
          $("input").prop('disabled', false);
          self.$(".button.submit > .fa, .button.create > .fa-refresh").remove();
          return;
        } else {

          self.creating = false;
          $("input").prop('disabled', false);
          self.$(".button.submit > .fa, .button.create > .fa-refresh").remove();
          self.$(".button.submit, .button.create").append('<i class="fa fa-check-circle"></i>');
          self.$(".button.submit > .fa, .button.create > .fa-check-circle").fadeOut(200).fadeIn(200).fadeOut(200).fadeIn(200).fadeOut(200);
          setTimeout(function() {
            self.$(".button_wrapper").addClass("hide");
            self.$(".tagContent").removeClass("small");
            self.$(".button.create > .fa").removeClass("fa-minus").addClass("fa-plus");
            self.$(".fa-refresh, .fa-minus, .fa-check-circle").remove();
            self.$("input[type=text]").val("");
            self.$("#start_slide").val(48);
            self.$("#start_time").text("12:00").addClass("right");
            self.$("#duration_slide").val(12);
            self.$("#duration_time").text("01:00").addClass("right");
          }, 1200);
          self.resubscribe(wifiList);
        }
      });
    }).bind(null, newTag, self);

    if (Meteor.isCordova)
      App.Utils.WifiWizard.getNearbyWifi(createNewTag);

    $("input").prop('disabled', true);
    self.$(".button.submit, .button.create").append('<i class="fa fa-refresh fa-spin"></i>');
    self.creating = true;
  }
});

Template.TopAnchor.helpers({
    //"getTagList": () => this.tagList
     "getTagList": () => {
       var count = Template.instance().refreshCount.get();
       console.log(JSON.stringify(Session.get("nearbyTags"), undefined, 2));
       return Session.get("nearbyTags");
     },

     "getDuration": function(tag) {
       var start, end;
       if (tag.duration == 1440) {
         var start = "00:00";
         var end = "24:00";
       } else {
         var start = moment("1970-01-01").add(tag.startTime, "minutes").format("HH:mm");
         var end = moment("1970-01-01").add(tag.startTime + tag.duration, "minutes").format("HH:mm");
       }
       return start + " - " + end;
     },

     "getRepetition": function(tag) {
       if (tag.repeat == 127) return "All Days";
       if (tag.repeat == 65) return "Weekends";
       if (tag.repeat == 62) return "Weekdays";

       var weekday = ["S ", "M ", "T ", "W ", "Th ", "F ", "S"];
       var repeat = tag.repeat.toString(2);
       var paddingL = 7 - repeat.length;
       for (var index = 0; index < paddingL; index++) {
         repeat = "0" + repeat;
       }

       var repeatStr = "";
       for (var index = 0; index < 7; index++) {
         if (repeat.charAt(index) == "1") {
           repeatStr += weekday[index];
         }
       }
       return repeatStr;
     },

     "checkRefreshDone": function(index) {
       var self = Template.instance();
       if (index == self.tagCount - 1) {
         console.log("done");
         self.isRefreshing.set(false);
       }
     },

     "isRefreshing": function() {
       return Template.instance().isRefreshing.get()? "": "hidden";
     },

     "isNotRefreshing": function() {
       return Template.instance().isRefreshing.get()? "hidden": "";
     },

     "trimName": function(str) {
       if (str.length > 10) {
         return str.substr(0, 10) + "...";
       } else {
         return str;
       }
     }
});
