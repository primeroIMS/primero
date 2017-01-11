_primero.Views.SummaryPage = Backbone.View.extend({
  el: 'div.side-tab-content',

  events: {
    'click span.subform_header label.key' : 'open_form'
  },

  initialize: function() {
    $('span.subform_header label.key').css('cursor', 'pointer');
  },

  open_form: function(event) {
    var $target = $(event.target);
    var target_subform_id = $target.parents('div.subforms').data('shared_subform');
    var target_form_id = $('#' + target_subform_id).parents('fieldset.tab').attr('id');
    $('div.side-tab ul li a[href="#' + target_form_id + '"]').click();
  }
});