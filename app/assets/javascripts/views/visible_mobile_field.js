_primero.Views.VisibleMobileField = Backbone.View.extend({
  el: '.field_details',
  events: {
    'change #field_details .visible' : 'form_visible_change',
    'change #field_details .visible_on_mobile' : 'form_visible_change_mobile'
  },

  initialize: function() {
    var $checkbox = $('#field_details').find('.visible');
    this.set_visible_for_mobile_status($checkbox);
  },

  form_visible_change: function(event) {
    var $checkbox = $(event.target);
    this.set_visible_for_mobile_status($checkbox);
  },

  form_visible_change_mobile: function(event) {
    var $checkbox = $(event.target);
    this.set_visible_for_minify_form($checkbox);
  },

  set_visible_for_mobile_status: function ($el) {
    var $checkbox_control = $el.parents('div').find('#field_details').find('.mobile_visible');
    this.change_checkbox_status($el, $checkbox_control);
    var $checkbox = $('#field_details').find('.visible_on_mobile');
    this.set_visible_for_minify_form($checkbox);
  },

  set_visible_for_minify_form: function ($el) {
    var $checkbox_control = $el.parents('div').find('#field_details').find('.short_form');
    this.change_checkbox_status($el, $checkbox_control)
  },

  change_checkbox_status: function ($el, $checkbox_control) {
    $checkbox_control.attr('disabled', !$el.is(':checked'));
    if ($el.is(':checked')) {
      $checkbox_control.show();
    } else {
      $checkbox_control.hide();
      $checkbox_control.find("input[type='checkbox']").attr('checked', false);
    }
  }
});