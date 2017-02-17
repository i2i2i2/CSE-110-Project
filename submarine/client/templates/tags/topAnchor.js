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
    document.addEventListener('touchmove', self.handleTouchMove);
  }

  self.handleTouchUp = function(event) {
    if (!self.moved) return;

    self.moved = false;
    document.removeEventListener('touchmove', self.handleTouchMove);
    $(".top_anchor").removeClass("drag");
    $('.top_anchor').removeAttr('style');

    if (Math.abs(self.mouseDownY - self.lastPointY) > 200 || self.velocity > 1) {
      $('.top_anchor').toggleClass('top').toggleClass('bottom');
      if ($(".top_anchor").hasClass("bottom")) {
        $(".whole_page").css({ "transition": "0.5s ease filter","filter": "blur(30px)"});
      }
      else{
        $(".whole_page").css({"transition": "0.5s ease filter","filter": ""});
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
      $(".whole_page").css({"filter": "blur(" + blur_px + "px)"});
    } else {
      if (diff > 0) diff = 0;
      if (diff < -self.windowHeight) diff = -self.windowHeight;
      self.$(".top_anchor").css("bottom", -diff + "px");
      var blur_px = 0.04*(736+diff);
      $(".whole_page").css({"filter": "blur(" + blur_px + "px)"});
    }
  }

});

Template.TopAnchor.onRendered(function() {
  document.addEventListener('touchstart', this.handleTouchDown);
  document.addEventListener('touchend', this.handleTouchUp);
});

Template.TopAnchor.onDestroyed(function() {
  document.removeEventListener('touchstart', this.handleTouchDown);
  document.removeEventListener('touchend', this.handleTouchUp);
});

Template.TopAnchor.events({
  "click .submarine_bg": function(e, t) {
    if (!t.moved) {
      t.$('.top_anchor').removeClass("drag").toggleClass('top').toggleClass('bottom');
       if ($(".top_anchor").hasClass("bottom")) {
            if($(".button[data-link=home]").hasClass("active"))
             $(".whole_page").css({ "transition": "0.5s ease filter", "filter": "blur(30px)",});
       }
       else {
          $(".whole_page").css({ "transition": "0.5s ease filter","filter": ""});
       }
    }

  },
  "click .create.button": function() {

      //$(".popUpWindow").fadeIn();

      $(".popUpWindow").animate({
            height: 'toggle'
        });
  }
});

