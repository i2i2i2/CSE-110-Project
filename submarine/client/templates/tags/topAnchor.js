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
      var time = moment("1970-01-01").add(4 + (read - 48) * 0.5 , "hours").format("HH:mm");
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
  }
});

Template.TopAnchor.helpers({
    //"getTagList": () => this.tagList
     "getTagList": () => ['tag1', 'tag2', 'tag3', 'tag4']
});
