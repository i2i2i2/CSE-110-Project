Template.TopAnchor.onCreated(function() {
  var self = this;

  // helper variable for drag
  self.mouseDownY = -1;
  self.lastPointY = -1;
  self.mousemoveTime = -1;
  self.velocity = -1;
  self.moved = false;
  self.windowHeight = $(window).height();
  self.nearbyTags = new ReactiveVar([]);

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
    if (errMsg == "No Days Selected") {
      $(".check").fadeOut(400).fadeIn(400).fadeOut(400).fadeIn(400);
      return;
    }

    DOM_element = DOM_element.parent();
    DOM_element.append('<div class="error"><i class="fa fa-minus-circle"></i>' + errMsg + '</div>');
    DOM_element.find(".error").fadeOut(400).fadeIn(400).fadeOut(400);
    setTimeout(function() {
      DOM_element.find(".error").remove();
    }, 2000);
  };

  if (Meteor.isCordova)
    App.Utils.WifiWizard.getNearbyWifi();

  self.autorun(function() {
    var wifiList = Session.get("wifiList");
    if (wifiList && wifiList.length) {
      self.wifiSubHandle = self.subscribe("wifis/nearbyWifis", wifiList);
    }
  })

  self.autorun(function() {

    var wifis = App.Collections.Wifis.find().fetch();
    if (!wifis.length) return;

    var tagIds = [];
    wifis.forEach((wifi) => {
      tagIds = tagIds.concat(wifi.tags);
    });

    Meteor.call("tags/getTagsById", tagIds, function(err, res) {
      if (err) return;
      self.nearbyTags.set(res);
    })
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

  "click .submarine_bg": function(e, t) {
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
  },

  "click .create.button": function(e, t) {
    if (Template.instance().creating) return;

    $(".button_wrapper").toggleClass("hide");
    $(".create.button > .fa").fadeOut(100);
    setTimeout(function() {
      $(".create.button > .fa").toggleClass("fa-plus").toggleClass("fa-minus").fadeIn(100);
    }, 100);
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
    newTag.startTime = $("#start_slide").val() * 5;
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

    var createNewTag = (function(newTag, self) {

      //get wifiList
      var wifiList= Session.get("wifiList");
      wifiList = wifiList.slice(0, wifiList.length >= 5? 5: wifiList.length);

      Meteor.call("tags/createTag", newTag, wifiList, (err, res) => {
        if (err) {
          console.log(JSON.stringify(err, undefined, 2));
          self.$(".button.submit > .fa, .button.create > .fa-refresh").remove();
          self.displayError($("input[name=chatroom_name]"), "Name Existed");
          return;
        }

        self.creating = false;
        $("input").prop('disabled', false);
        self.$(".button.submit > .fa, .button.create > .fa-refresh").remove();
        self.$(".button.submit, .button.create").append('<i class="fa fa-check-circle"></i>');
        self.$(".button.submit > .fa, .button.create > .fa-check-circle").fadeOut(200).fadeIn(200).fadeOut(200).fadeIn(200).fadeOut(200);
        setTimeout(function() {
          self.$(".button_wrapper").addClass("hide");
          self.$(".button.create > .fa").removeClass("fa-minus").addClass("fa-plus");
          self.$(".fa-refresh, .fa-minus, .fa-check-circle").remove();
          self.$("input[type=text]").val("");
          self.$("#start_slide").val(48);
          self.$("#start_time").text("12:00").addClass("right");
          self.$("#duration_slide").val(12);
          self.$("#duration_time").text("01:00").addClass("right");
        }, 1200)
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
       console.log(JSON.stringify(Template.instance().nearbyTags.get(), undefined, 2));
     }
});
