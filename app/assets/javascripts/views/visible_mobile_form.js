/* Each tick_box has a hidden_field wich needs to be enabled/disabled when unchecking/checking the checkbox.
 * When a checkbox is unchecked the browser won't send it's value, so the hidden_field will send the default value.
 * When the checkbox is checked the hidden_field should be disabled and send no value.
 */
_primero.Views.VisibleMobileForm = _primero.Views.Base.extend({
  el: '.form-section-content',
  events: {
    'change input.visible' : 'form_visible_change'
  },

  initialize: function() {
    var checkbox = $('input.visible');
    this.set_checkbox_status(checkbox);
  },

  form_visible_change: function(event) {
    var checkbox = $(event.target);
    this.set_checkbox_status(checkbox);
  },

  set_checkbox_status: function (el) {
    var checkbox_control = el.parents('div').find('.mobile_form');
    checkbox_control.attr('disabled', !el.is(':checked'));
    if (el.is(':checked')) {
      checkbox_control.show();
    } else {
      checkbox_control.hide();
      checkbox_control.find("input[type='checkbox']").attr('checked', false);
    }
  }
});