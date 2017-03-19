Template.TopAnchor.onCreated(function() {
  var self = this;

  // helper variable for drag
  self.mouseDownY = -1;
  self.lastPointY = -1;
  self.mousemoveTime = -1;
  self.velocity = -1;
  self.moved = false;
  self.windowHeight = $(window).height();

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
        if (Meteor.isCordova) {
          App.Utils.WifiWizard.getNearbyWifi(self.resubscribe);
          self.refreshing();
        }
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

  if (Meteor.isCordova) {
    App.Utils.WifiWizard.getNearbyWifi(self.resubscribe);
  }

  self.refreshNearbyTags = (function() {
    var self = this;
    var wifis = App.Collections.Wifis.find().fetch();
    if (!wifis.length) return;

    var tagIds = [];
    wifis.forEach((wifi) => {//jhj
      tagIds = tagIds.concat(wifi.tags);
    });

    self.refreshing();

    Meteor.call("tags/getTagsById", tagIds, function(err, res) {
      console.log("refresh tags  " + Date.now());
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

      console.log("TagList Length: " + tagList.length);

      self.clearTag();
      if (!tagList || tagList.length == 0) {

        self.noTag();
        self.doneRefresh();

      } else {
        Session.set("nearbyTags", tagList);
        tagList.forEach(tag => {
          self.appendTag(tag);
        });
        self.doneRefresh();
      }
    });
  }).bind(self);

  self.resubscribe = (function(wifiList) {
    var self = this;
    console.log("refresh wifiList  " + Date.now());

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
  });

  self.trimName = function(str) {
    if (str.length > 10) {
      return str.substr(0, 10) + "...";
    } else {
      return str;
    }
  };

  self.avatar = function (profileSeed) {
    // map string to number array
    if (!profileSeed) return;

    var numArr = profileSeed.split("").map(char => {
      var num = char.charCodeAt(0);
      if (num < 65) {
        return (num - 48)/62;
      } else if (num < 97) {
        return (num - 55)/62;
      } else {
        return (num - 61)/62;
      }
    });

    // generate rgb color
    var num = Math.ceil((numArr[0] + numArr[1]/10) / 1.1 * 12);
    var h = numArr[2];
    var s = 0.7 * numArr[3];
    var v = 1 - 0.7 * numArr[4];
    var main = HSVtoRGB(h, s, v);

    if (numArr[5] < 0.33)
      var h1 = (h + 0.5) % 1;
    else if (numArr[5] < 0.67)
      var h1 = (h + 0.1) % 1;
    else
      var h1 = h;
    var s1 = 0.3 * numArr[6];
    var v1 = 1 - 0.3 * numArr[7];
    var sub = HSVtoRGB(h1, s1, v1);
    colorDist(main, sub)

    var svg =
        '<svg style="' + "--main:" + toBase16Color(main) + ";--sub:" + toBase16Color(sub) + ';" viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">'
      +   '<use href="/avatar' + num + '.svg#avatar"></use>'
      + '</svg>';

    return Spacebars.SafeString(svg);

    function HSVtoRGB(h, s, v) {
      var r, g, b, i, f, p, q, t;

      i = Math.floor(h * 6);
      f = h * 6 - i;
      p = v * (1 - s);
      q = v * (1 - f * s);
      t = v * (1 - (1 - f) * s);
      switch (i % 6) {
        case 0: r = v, g = t, b = p; break;
        case 1: r = q, g = v, b = p; break;
        case 2: r = p, g = v, b = t; break;
        case 3: r = p, g = q, b = v; break;
        case 4: r = t, g = p, b = v; break;
        case 5: r = v, g = p, b = q; break;
      }

      return { r: Math.round(r * 255),
               g: Math.round(g * 255),
               b: Math.round(b * 255)};
    }

    function toBase16Color(color) {
      function padding(str) {
        if (str.length == 1) return "0" + str;
        else return str;
      }
      return "#" + color.r.toString(16)
                 + color.g.toString(16)
                 + color.b.toString(16);
    }

    function colorDist(color1, color2) {
      var bright1 = Math.sqrt(.241 * color1.r * color1.r
                            + .691 * color1.g * color1.g
                            + .068 * color1.b * color1.b);
      var bright2 = Math.sqrt(.241 * color2.r * color2.r
                            + .691 * color2.g * color2.g
                            + .068 * color2.b * color2.b);
      if (bright1 - bright2 > 100) {
        return;
      } else if (bright1 - bright2 < -100) {
        return;
      } else if (bright1 - bright2 > 0) {
        color2.r -= 6;
        if (color2.r < 0) color2.r = 0;
        color2.g -= 14;
        if (color2.g < 0) color2.g = 0;
        color2.b -= 2;
        if (color2.b < 0) color2.b = 0;
        color1.r += 6;
        if (color1.r > 255) color1.r = 255;
        color1.g += 14;
        if (color1.g > 255) color1.g = 255;
        color1.b += 2;
        if (color1.b > 255) color1.b = 255;
        return;
      } else {
        color1.r -= 6;
        if (color1.r < 0) color1.r = 0;
        color1.g -= 14;
        if (color1.g < 0) color1.g = 0;
        color1.b -= 2;
        if (color1.b < 0) color1.b = 0;
        color2.r += 6;
        if (color2.r > 255) color2.r = 255;
        color2.g += 14;
        if (color2.g > 255) color2.g = 255;
        color2.b += 2;
        if (color2.b > 255) color2.b = 255;
        return;
      }
    }
  };

  self.getDuration = function(tag) {
    var start, end;
    if (tag.duration == 1440) {
      var start = "00:00";
      var end = "24:00";
    } else {
      var start = moment("1970-01-01").add(tag.startTime, "minutes").format("HH:mm");
      var end = moment("1970-01-01").add(tag.startTime + tag.duration, "minutes").format("HH:mm");
    }
    return start + " - " + end;
  };

  self.getRepetition = function(tag) {
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
  };

  self.appendTag = function(tag) {
    var html = "";
    html += '<div class="tag_wrapper" data-tag-id="' + tag._id + '">'
            + '<div class="tag_name">'
              + '<i class="fa fa-anchor" aria-hidden="true"></i>'
              + self.trimName(tag.name)
            + '</div>'
            + '<div class="tag_content">'
              + '<div class="tag_avatar">' + self.avatar(tag._id) + '</div>'
              + '<div class="tag_duration">' + self.getDuration(tag) + '</div>'
              + '<div class="tag_repeat">' + self.getRepetition(tag) + '</div>'
              + '<div class="tag_description">' + tag.description + '</div>'
            + '</div>'
          + '</div>';

    $('.tagContent').append(html);
  }

  self.refreshing = function() {
    $('.tagContent').addClass('hidden');
    $('.refreshing').removeClass('hidden');
  }

  self.doneRefresh = function() {
    $('.tagContent').removeClass('hidden');
    $('.refreshing').addClass('hidden');
  }

  self.noTag = function() {
    $('.tagContent').html('<p> No Nearby Chatrooms, <br> Turn on Wifi, <br> Or Change your Location. </p>');
  }

  self.clearTag = function() {
    $('.tagContent').html("");
  }
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
  if (self.observeWifiChange)
    self.observeWifiChange.stop();
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

  "click .tag_wrapper": function (e, t) {
    var idNumber = e.currentTarget.dataset.tagId;

    $('.top_anchor').addClass('top').removeClass('bottom');
    $('.drag').removeClass("drag");
    $("body > .content").removeAttr("style").fadeOut(100).fadeIn(100);
    setTimeout(function() {
      FlowRouter.go('/user/tag_profile/' + idNumber);
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
