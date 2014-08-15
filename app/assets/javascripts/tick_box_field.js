var TickBoxField = Backbone.View.extend({
  el: '.page_content form',
  events: {
    'change input.tick_box' : 'tick_box_change'
  },

  initialize: function() {
    $('input.tick_box').each(function(){
      var tick_box = $(this);
      var tick_box_control = tick_box.parent().find("input[type='hidden']");
      if (tick_box.is(':checked')) {
        tick_box_control.attr('disabled', true);
      } else {
        tick_box_control.attr('disabled', false);
      }
    });
  },

  tick_box_change: function(event) {
    var tick_box = $(event.target);
    var tick_box_control = tick_box.parent().find("input[type='hidden']");
    if (tick_box.is(':checked')) {
      tick_box_control.attr('disabled', true);
    } else {
      tick_box_control.attr('disabled', false);
    }
  }
});

$(document).ready(function(){
  new TickBoxField();
})