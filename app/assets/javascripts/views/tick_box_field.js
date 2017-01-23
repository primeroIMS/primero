/* Each tick_box has a hidden_field wich needs to be enabled/disabled when unchecking/checking the checkbox.
 * When a checkbox is unchecked the browser won't send it's value, so the hidden_field will send the default value.
 * When the checkbox is checked the hidden_field should be disabled and send no value.
 */
_primero.Views.TickBoxField = _primero.Views.Base.extend({
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
      } else if (!tick_box.is(':disabled')) {
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