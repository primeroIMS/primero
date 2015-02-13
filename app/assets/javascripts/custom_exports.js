var CustomExports = Backbone.View.extend({
  el: '#custom-exports',

  events: {
    'change input[name="format"]': 'set_form_state',
    'change input[name="forms"]': 'retrieve_field_names'
  },

  initialize: function() {
    this.init_chosen_fields();

    this.forms_selector = $('fieldset.custom_export_form');
    this.fields_selector = $('fieldset.custom_export_fields');
    this.get_fields = $('a.get_fields');
  },

  init_chosen_fields: function() {
    var self = this;

    $('select[name="module"]').chosen().change(function() {
      self.set_form_state();
    });

    $('select[name="fields"]').chosen();
    $('select[name="forms"]').chosen();
  },

  set_form_state: function(e) {
    var value = $('input[name="format"]:checked').val(),
        forms_selector = $('fieldset.custom_export_form'),
        fields_selector = $('fieldset.custom_export_fields'),
        module_selector = $('select[name="module"]');

    if (value == 'forms' && module_selector.val().length) {
      this.retrieve_form_names();
    } else if (value == 'fields' && module_selector.val().length) {
      this.retrieve_field_names();
    }
  },

  retrieve_form_names: function() {
    var module_control = $('select[name="module"]'),
        format_control = $('input[name="format"]'),
        data = {
          record_type: 'case',
          module: module_control.val()
        };
    console.log(this.forms_selector)
    this.forms_selector.show();
    this.fields_selector.show();

    $.get('/custom_exports/permitted_forms_list', data, function(res) {
      var select_control = $('select[name="forms"]');

      _.each(res, function(form) {
        var select_option = '<option value="' + form.id + '">'+ form.name + '</option>';
        select_control.append(select_option);
      });

      select_control.trigger("chosen:updated");
    });
  },

  retrieve_field_names: function(from_forms) {
    console.log('getting fields')
    var data = {

    };

    if (!from_forms) {
      this.forms_selector.find('select').empty();
      this.forms_selector.find('select').trigger("chosen:updated");
      this.forms_selector.hide();
      this.fields_selector.show();
    }

    // $.get('', data, function() {

    // });
  },

  submit_export_request: function(e) {

  }
});

$('document').ready(function() {
  new CustomExports();
});
