var AutosumFields = Backbone.View.extend({
  el: '.page_content form',
  events: {
    'change input.autosum[type="text"]' : 'autosum_field_change',
    'keypress input.autosum[type="text"]': 'only_allow_digits'
  },

  autosum_field_change: function(event) {
    _primero.update_autosum_field($(event.target));
  },

  only_allow_digits: function(event) {
    if (event.which != 8 && event.which !== 0 && (event.which < 48 || event.which > 57)) {
      return false;
    }
  }
});

$(document).ready(function(){
  new AutosumFields();
});