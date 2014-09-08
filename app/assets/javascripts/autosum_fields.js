var AutosumFields = Backbone.View.extend({
  el: '.page_content form',
  events: {
    'change input.autosum[type="text"]' : 'autosum_field_change'
  },

  autosum_field_change: function(event) {
    var autosum_total = 0;
    var input = $(event.target);
    var autosum_group = input.attr('autosum_group');
    var fieldset = input.parents('.summary_group');
    var autosum_total_input = fieldset.find('input.autosum_total[type="text"][autosum_group="' + autosum_group + '"]');
    fieldset.find('input.autosum[type="text"][autosum_group="' + autosum_group + '"]').each(function(){
      var value = $(this).val();
      if(!isNaN(value) && value != ""){
        autosum_total += parseFloat(value);
      }
    });
    autosum_total_input.val(autosum_total);
  }
});

$(document).ready(function(){
  new AutosumFields();
})