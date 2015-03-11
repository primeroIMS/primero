var PdfExports = Backbone.View.extend({
  el: '#pdf-exports',

  events: {
    'change div#pdf-exports select[name="module"]' : 'set_form_state',
    'click div#pdf-exports button#submit_export': 'submit_export_request'
  },

  initialize: function() {
    var self = this;

    this.forms_selector = $('fieldset.pdf_export_form');
    this.record_type = $(this.el).data('record-type');
    this.module_id = $(this.el).data('module-id');
    this.record_id = $(this.el).data('record-id');
    this.model_class = $(this.el).data('model-class');
    // TODO - tighten this up
    this.filter_type = 'case_pdf';

    this.init_chosen_fields();

    if (this.module_id) {
      var select_module = $(this.el).find('select[name="module"]');
      select_module.hide();
      select_module.prev().hide();
    }

    $(document).on('close.fndtn.reveal', '#pdf-exports', function () {
      self.reset_form();
    });
  },

  init_chosen_fields: function() {
    var self = this;

    self.set_form_state();

    $('select[name="forms"]').chosen();
  },

  toggle_loading_indicator: function(action) {
    if (action == 'show') {
      $(this.el).find('.loading').show();
    } else {
      $(this.el).find('.loading').hide();
    }
  },

  set_form_state: function(e) {
    var forms_selector = $('fieldset.pdf_export_form'),
        module_selector = $(this.el).find('select[name="module"]');

    if (module_selector.val().length || this.module_id.length) {
      this.retrieve_form_names();
    }
  },

  clear_control: function(control) {
    var control = this.forms_selector;
    select_control = control.find('select');
    select_control.empty();
    select_control.trigger('chosen:updated');
  },

  retrieve_form_names: function() {
    this.toggle_loading_indicator('show');

    var self = this,
        module_control = $(this.el).find('select[name="module"]'),
        data = {
          record_type: this.record_type,
          module: module_control.val() || this.module_id
        };

      $.get('/custom_exports/permitted_forms_list', data, function(res) {
        var select_control = $('#pdf-exports select[name="forms"]');

        self.clear_control('forms');

        _.each(res, function(form) {
          var select_option = '<option value="' + form.name + '">'+ form.name + '</option>';
          select_control.append(select_option);
        });

        select_control.trigger("chosen:updated");
        self.toggle_loading_indicator('hide');
      });
  },

  submit_export_request: function(e) {
    e.preventDefault();

    var password_control = $(this.el).find('#password-field'),
        module_control = $(this.el).find('select[name="module"]'),
        filename_control = $(this.el).find('#export-filename'),
        forms_control = $(this.el).find('select[name="forms"]'),
        message = $(this.el).find('.message');

    if (password_control.val().length &&
        forms_control.val() &&
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
          fields: [],
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

      // TODO - revisit this!!!
      if (!forms_control.val() ) {
        errors.push($(this.el).data('empty-fields-forms'));
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
    $(this.el).find('.message').empty().hide();
  }
});

$('document').ready(function() {
  new PdfExports();
});
