Template.TopAnchor.onCreated(function() {
  var self = this;

  // helper variable for drag
  self.mouseDownY = -1;
  self.lastPointY = -1;
  self.mousemoveTime = -1;
  self.velocity = -1;
  self.moved = false;
  self.leaved = false;

  self.handleMouseMove = function(event) {
    self.moved = true;
    var now = Date.now();
    self.velocity = Math.abs((event.pageY - self.lastPointY)/(now - self.mousemoveTime));
    self.lastPointY = event.pageY;
    self.mousemoveTime = now;
    var diff = self.lastPointY - self.mouseDownY;
    if ($(".top_anchor").hasClass("top")) {
      if (diff < 0) diff = 0;
      if (diff > $(window).height()) diff = $(window).height();
    } else {
      if (diff > 0) diff = 0;
      if (diff < -$(window).height()) diff = -$(window).height();
    }

    self.$(".top_anchor").css("transform", "translateY(" + diff + "px)");
  }

  self.handleMouseLeave = function(event) {
    if (!self.leaved) {
      self.leaved = true;
      $("body").off('mousemove', ".submarine_bg", self.handleMouseMove);
      $(".top_anchor").removeClass("drag");
      $('.top_anchor').removeAttr('style');
      if (Math.abs(self.mouseDownY - event.pageY) > 200 || self.velocity > 1) {
        $('.top_anchor').toggleClass('top').toggleClass('bottom');
      }
    }
  }

  self.handleTouchDown = function(event) {

    var touch = event.touches.item(0);
    if(!$(".submarine_bg").has($(document.elementFromPoint(touch.pageX,touch.pageY))).length)
      return;

    self.lastPointY = self.mouseDownY = event.touches.item(0).pageY;
    self.mousemoveTime = Date.now().value;
    self.velocity = 0;
    self.moved = false;
    self.leaved = false;

    $(".top_anchor").addClass("drag");
    document.addEventListener('touchmove', self.handleTouchMove);
  }

  self.handleTouchUp = function(event) {

    document.removeEventListener('touchmove', self.handleTouchMove);
    $(".top_anchor").removeClass("drag");
    $('.top_anchor').removeAttr('style');

    if (Math.abs(self.mouseDownY - self.lastPointY) > 200 || self.velocity > 1) {
      $('.top_anchor').toggleClass('top').toggleClass('bottom');
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
      if (diff > $(window).height()) diff = $(window).height();
    } else {
      if (diff > 0) diff = 0;
      if (diff < -$(window).height()) diff = -$(window).height();
    }

    self.$(".top_anchor").css("transform", "translateY(" + diff + "px)");
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
    if (!t.moved)
      t.$('.top_anchor').toggleClass('top').toggleClass('bottom');
  },

  "mousedown .submarine_bg": function(e, t) {
    t.lastPointY = t.mouseDownY = e.pageY;
    t.mousemoveTime = Date.now().value;
    t.velocity = 0;
    t.moved = false;
    t.leaved = false;

    $(".top_anchor").addClass("drag");
    $("body").on('mousemove', ".submarine_bg", t.handleMouseMove);
    $("body").on('mouseleave', ".submarine_bg", t.handleMouseLeave);
  },

  "mouseup .submarine_bg": function(e, t) {
    $("body").off('mouseleave', ".submarine_bg", t.handleMouseLeave);
    if (t.leaved) return;

    $("body").off('mousemove', ".submarine_bg", t.handleMouseMove);
    $(".top_anchor").removeClass("drag");
    t.$('.top_anchor').removeAttr('style');

    if (Math.abs(t.mouseDownY - e.pageY) > 200 || t.velocity > 1) {
      $('.top_anchor').toggleClass('top').toggleClass('bottom');
    }
  }
});
