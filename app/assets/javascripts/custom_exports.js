var CustomExports = Backbone.View.extend({
  el: '#custom-exports',

  events: {
    'change input[name="format"]': 'set_form_state',
    'change input[name="forms"]': 'retrieve_field_names',
    'change input[name="choose_fields"]': 'toggle_field_selection',
    'click button#submit_export': 'submit_export_request'
  },

  initialize: function() {
    var self = this;

    this.init_chosen_fields();
    this.forms_selector = $('fieldset.custom_export_form');
    this.fields_selector = $('fieldset.custom_export_fields');
    this.get_fields = $('a.get_fields');
    this.record_type = $(this.el).data('record-type');
    this.module_id = $(this.el).data('module-id');
    this.record_id = $(this.el).data('record-id');
    this.model_class = $(this.el).data('model-class');
    this.filter_type = 'xls';


    if (this.module_id) {
      var select_module = $('select[name="module"]');
      select_module.next().hide();
      select_module.prev().hide();
    }

    $(document).on('close.fndtn.reveal', '#custom-exports', function () {
      self.reset_form();
    });
  },

  init_chosen_fields: function() {
    var self = this;

    $('select[name="module"]').chosen().change(function() {
      self.set_form_state();
    });

    $('select[name="fields"]').chosen();
    $('select[name="forms"]').chosen();
  },

  toggle_field_selection: function(e) {
    if ($(e.target).is(':checked')) {
      this.fields_selector.show();
      this.forms_selector.hide();
      this.clear_control('forms');
      this.retrieve_field_names();
    } else {
      this.fields_selector.hide();
      this.forms_selector.show();
      this.set_form_state();
    }
  },

  toggle_choose_field_control: function() {
    var form_value = $('input[name="format"]:checked'),
        choose_fields = $('.user_select_fields');

    if (form_value.val() == 'forms') {
      choose_fields.show();
    } else {
      choose_fields.hide();
    }
  },

  toggle_loading_indicator: function(action) {
    if (action == 'show') {
      $('.loading').show();
    } else {
      $('.loading').hide();
    }
  },

  set_form_state: function(e) {
    var value = $('input[name="format"]:checked').val(),
        forms_selector = $('fieldset.custom_export_form'),
        fields_selector = $('fieldset.custom_export_fields'),
        module_selector = $('select[name="module"]');

    forms_selector.hide();
    fields_selector.hide();
    this.toggle_choose_field_control();

    if (value == 'forms' && (module_selector.val().length || this.module_id.length)) {
      this.retrieve_form_names();
    } else if (value == 'fields' && (module_selector.val().length || this.module_id.length)) {
      this.retrieve_field_names();
    }
  },

  clear_control: function(control) {
    var control = control == 'forms' ? this.forms_selector : this.fields_selector;
    select_control = control.find('select');
    select_control.empty();
    select_control.trigger('chosen:updated');
  },

  retrieve_form_names: function() {
    this.toggle_loading_indicator('show');

    var self = this,
        module_control = $('select[name="module"]'),
        choose_fields = $('input[name="choose_fields"]'),
        data = {
          record_type: this.record_type,
          module: module_control.val() || this.module_id
        };

    if (!choose_fields.is(':checked')) {
      this.forms_selector.show();

      $.get('/custom_exports/permitted_forms_list', data, function(res) {
        var select_control = $('select[name="forms"]');

        self.clear_control('forms');

        _.each(res, function(form) {
          var select_option = '<option value="' + form.name + '">'+ form.name + '</option>';
          select_control.append(select_option);
        });

        select_control.trigger("chosen:updated");
        self.toggle_loading_indicator('hide');
      });
    }
  },

  retrieve_field_names: function(from_forms) {
    this.toggle_loading_indicator('show');

    var self = this,
        module_control = $('select[name="module"]'),
        data = {
          record_type: this.record_type,
          module: module_control.val() || this.module_id,
        };

    self.clear_control('fields');
    this.fields_selector.show();

    $.get('/custom_exports/permitted_fields_list', data, function(res) {
      var select_control = $('select[name="fields"]');

      self.clear_control('fields');

      _.each(res, function(form) {
        var options = [];
        _.each(_.last(form), function(fields) {
          options.push('<option value="' + fields[1] + '">'+ fields[0] + '</option>');
        });
        select_control.append('<optgroup label="' + _.first(form) + '">' + options + '</optgroup>');
      });

      select_control.trigger('chosen:updated');
      self.toggle_loading_indicator('hide');
    });
  },

  submit_export_request: function(e) {
    e.preventDefault();

    var password_control = $('#password-field'),
        module_control = $('select[name="module"]'),
        filename_control = $('#export-filename'),
        fields_control = $('select[name="fields"]'),
        forms_control = $('select[name="forms"]'),
        message = $('.message'),
        format_control = $('input[name="format"]'),
        choose_fields = $('input[name="choose_fields"]');

    if (fields_control.val() && !choose_fields.is(':checked')) {
      this.filter_type = 'selected_xls';
    }

    if (password_control.val().length &&
        (forms_control.val() || fields_control.val()) &&
        (module_control.val().length || this.module_id.length)) {

      var data = {
        custom_export_file_name: filename_control.val(),
        password: password_control.val(),
        selected_records: _primero.indexTable.get_selected_records().join(","),
        custom_exports: {
          record_id: this.record_id,
          record_type: this.record_type,
          module:  module_control.val() || this.module_id,
          forms: forms_control.val() || [],
          fields: fields_control.val() || [],
          model_class: this.model_class
        }
      };

      file_location = window.location.href + window.location.search;
      file_location += window.location.search.length ? '&' : '?';
      file_location += $.param(data);
      file_location += '&format=' + this.filter_type;
      file_location += !_primero.get_param('page') ? '&page=all&per_page=all' : undefined;

      this.reset_form();
      $(this.el).foundation('reveal', 'close');
      window.disable_loading_indicator = true;
      window.location = file_location;
    } else {

      var errors = [];

      if (!password_control.val().length) {
        errors.push($(this.el).data('empty-password'));
      }

      if (!forms_control.val() && !fields_control.val()) {
        errors.push($(this.el).data('empty-fields-forms'));
      }

      if (!format_control.val().length) {
        errors.push($(this.el).data('empty-format'));
      }

      if (!module_control.val().length && !this.module_id.length) {
        errors.push($(this.el).data('empty-module'));
      }

      message.html(_.last(errors)).show();
    }
  },

  reset_form: function() {
    $(this.el).find('form')[0].reset();
    $(this.el).find('select').val('').trigger("chosen:updated");
    this.clear_control('fields');
    this.clear_control('forms');
    this.forms_selector.hide();
    this.fields_selector.hide();
    $('.user_select_fields').hide();
    $('.message').empty().hide();
  }
});

$('document').ready(function() {
  new CustomExports();
});
