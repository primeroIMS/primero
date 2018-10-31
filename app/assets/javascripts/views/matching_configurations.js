_primero.Views.MatchingConfigurations = _primero.Views.Base.extend({
  el: 'body',

  events: {
    'change select#case_forms': 'update_case_form',
    'change select#tracing_request_forms': 'update_tracing_request_form'
  },

  update_case_form: function (e) {
    this.markFormsVisibility($(e.target).val(), ".matching_configuration_case_forms");
  },

  update_tracing_request_form: function (e) {
    this.markFormsVisibility($(e.target).val(), ".matching_configuration_tracing_request_forms");
  },

  markFormsVisibility: function(selected_forms, forms_selector) {
    $(forms_selector).each(function(i, object) {
      object.style.display = 'none';
      if(selected_forms && selected_forms.includes(object.id)) {
        object.style.display = 'block';
      }
    });
  }
});