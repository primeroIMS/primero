_primero.Views.SummaryPage = _primero.Views.Base.extend({
  el: '.side-tab-content',

  events: {
    'click .subform_header label.key' : 'open_form'
  },

  initialize: function() {
    $('.subform_header label.key').css('cursor', 'pointer');
  },

  open_form: function(event) {
    var $target = $(event.target);
    var target_subform_id = $target.parents('.subforms').data('shared_subform');
    var target_form_id = $('#' + target_subform_id).parents('fieldset.tab').attr('id');
    $('.side-tab ul li a[href="#' + target_form_id + '"]').click();
  }
});