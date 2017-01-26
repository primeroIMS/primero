_primero.Views.AutosumFields = _primero.Views.Base.extend({
  el: '.page_content form',

  events: {
    'change input.autosum[type="text"]' : 'autosum_field_change',
    'keypress input.autosum[type="text"]': 'only_allow_digits',
    'paste input.autosum[type="text"]': 'only_allow_digits_paste'
  },

  autosum_field_change: function(event) {
    _primero.update_autosum_field(this.$(event.target));
  },

  only_allow_digits: function(event) {
    if (event.which != 8 && event.which !== 0 && (event.which < 48 || event.which > 57)) {
      return false;
    }
  },

  only_allow_digits_paste: function(event) {
    var control = this.$(event.target);
    setTimeout(function() {
      var new_val = control.val().replace(/\D/g, '');
      control.attr('value', new_val);
      _primero.update_autosum_field(control);
      _primero.shared_fields.find_shared_fields(event);
    }, 0);
  }
});