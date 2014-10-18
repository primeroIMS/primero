var AutosumFields = Backbone.View.extend({
  el: '.page_content form',
  events: {
    'change input.autosum[type="text"]' : 'autosum_field_change'
  },

  autosum_field_change: function(event) {
    _primero.update_autosum_field($(event.target));
  }
});

$(document).ready(function(){
  new AutosumFields();
})