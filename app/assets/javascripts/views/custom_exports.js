_primero.Views.CustomExports = Backbone.View.extend({
  el: '#custom-exports',

  events: {
    'change input[name="format"]': 'set_form_state',
    'change input[name="forms"]': 'retrieve_field_names',
    'change input[name="choose_fields"]': 'toggle_field_selection',
    'click #submit_export': 'submit_export_request'
  },

  initialize: function() {
    var self = this;
    var $this_el = $(this.el);

    this.init_chosen_fields();
    this.$forms_selector = $('.custom_export_form');
    this.$fields_selector = $('.custom_export_fields');
    this.record_type = $this_el.data('record-type');
    this.module_id = $this_el.data('module-id');
    this.record_id = $this_el.data('record-id');
    this.model_class = $this_el.data('model-class');
    this.filter_type = 'xls';
    this.password_control = this._create_password_field();

    if (this.module_id) {
      var select_module = $this_el.find('select[name="module"]');
      select_module.next().hide();
      select_module.prev().hide();
    }

    function reset_form() {
      self.reset_form();
    }

    $(document).on('close.fndtn.reveal', '#custom-exports', reset_form);
  },

  init_chosen_fields: function() {
    var self = this;
    var $this_el = $(this.el);
    $this_el.find('select[name="module"]').chosen().change(function() {
      self.set_form_state();
    });

    $this_el.find('select[name="fields"]').chosen();
    $this_el.find('select[name="forms"]').chosen();
  },

  toggle_field_selection: function(e) {
    if ($(e.target).is('input:checked')) {
      this.$fields_selector.show();
      this.$forms_selector.hide();
      this.clear_control('forms');
      this.retrieve_field_names();
    } else {
      this.$fields_selector.hide();
      this.$forms_selector.show();
      this.set_form_state();
    }
  },

  toggle_choose_field_control: function() {
    var $form_value = $(this.el).find('input[name="format"]:checked'),
      $choose_fields = $('.user_select_fields');

    if ($form_value.val() == 'forms') {
      $choose_fields.show();
    } else {
      $choose_fields.hide();
    }
  },

  toggle_loading_indicator: function(action) {
    var $this_el = $(this.el);
    if (action == 'show') {
      $this_el.find('.loading').show();
    } else {
      $this_el.find('.loading').hide();
    }
  },

  set_form_state: function(e) {
    var value = $(this.el).find('input[name="format"]:checked').val(),
      $forms_selector = $('fieldset.custom_export_form'),
      $fields_selector = $('fieldset.custom_export_fields'),
      $module_selector = $(this.el).find('select[name="module"]');

    $forms_selector.hide();
    $fields_selector.hide();
    this.toggle_choose_field_control();

    if ($module_selector.val() || this.module_id.length) {
      if (value == 'forms') {
        this.retrieve_form_names();
      } else if (value == 'fields') {
        this.retrieve_field_names();
      }
    }
  },

  clear_control: function(control) {
    var $control = control == 'forms' ? this.$forms_selector : this.$fields_selector;
    $select_control = $control.find('select');
    $select_control.empty();
    $select_control.trigger('chosen:updated');
  },

  retrieve_form_names: function() {
    this.toggle_loading_indicator('show');

    var $this_el = $(this.el);
    var self = this,
      $module_control = $this_el.find('select[name="module"]'),
      $choose_fields = $this_el.find('input[name="choose_fields"]'),
      data = {
        record_type: this.record_type,
        module: $module_control.val() || this.module_id,
        only_parent: true
      };

    if (!$choose_fields.is(':checked')) {
      this.$forms_selector.show();

      $.get('/custom_exports/permitted_forms_list', data, function(res) {
        var $select_control = $('#custom-exports').find('select[name="forms"]');

        self.clear_control('forms');

        var select_options = [];
        _.each(res, function(form) {
          select_options.push('<option value="' + form.name + '">'+ form.name + '</option>');
        });
        $select_control.html(select_options.join(''));

        $select_control.trigger("chosen:updated");
        self.toggle_loading_indicator('hide');
      });
    }
  },

  retrieve_field_names: function(from_forms) {
    this.toggle_loading_indicator('show');

    var self = this,
      $module_control = $(this.el).find('select[name="module"]'),
      data = {
        record_type: this.record_type,
        module: $module_control.val() || this.module_id,
      };

    self.clear_control('fields');
    this.$fields_selector.show();

    $.get('/custom_exports/permitted_fields_list', data, function(res) {
      var $select_control = $('#custom-exports').find('select[name="fields"]');

      self.clear_control('fields');

      var custom_exports = [];
      _.each(res, function(form) {
        var options = [];
        _.each(_.last(form), function(fields) {
          options.push('<option value="' + fields[1] + '">'+ fields[0] + '</option>');
        });
        custom_exports.push('<optgroup label="' + _.first(form) + '">' + options + '</optgroup>');
      });
      $select_control.html(custom_exports.join(''));

      $select_control.trigger('chosen:updated');
      self.toggle_loading_indicator('hide');
    });
  },

  submit_export_request: function(e) {
    e.preventDefault();

    var $this_el = $(this.el);
    var password_control = this.password_control,
      $module_control = $this_el.find('select[name="module"]'),
      $filename_control = $this_el.find('#export-filename'),
      $fields_control = $this_el.find('select[name="fields"]'),
      $forms_control = $this_el.find('select[name="forms"]'),
      $message = $this_el.find('.message'),
      $format_control = $this_el.find('input[name="format"]'),
      $choose_fields = $this_el.find('input[name="choose_fields"]');

    if ($fields_control.val() && !$choose_fields.is(':checked')) {
      this.filter_type = 'selected_xls';
    }

    if (password_control.val() &&
        ($forms_control.val() || $fields_control.val()) &&
        ($module_control.val() || this.module_id.length)) {

      var data = {
        custom_export_file_name: $filename_control.val(),
        password: password_control.val(),
        selected_records: _primero.indexTable.get_selected_records().join(","),
        custom_exports: {
          record_id: this.record_id,
          record_type: this.record_type,
          module:  $module_control.val() || this.module_id,
          forms: $forms_control.val() || [],
          fields: $fields_control.val() || [],
          model_class: this.model_class
        }
      };

      file_location = window.location.href + window.location.search;
      file_location += window.location.search.length ? '&' : '?';
      file_location += $.param(data);
      file_location += '&format=' + this.filter_type;
      file_location += !_primero.get_param('page') ? '&page=all&per_page=all' : undefined;

      this.reset_form();
      $this_el.foundation('reveal', 'close');
      _primero.check_download_status();
      window.location = file_location;
    } else {
      var errors = [];

      if (!password_control.val()) {
        errors.push($this_el.data('empty-password'));
      }

      if (!$forms_control.val() && !$fields_control.val()) {
        errors.push($this_el.data('empty-fields-forms'));
      }

      if (!$format_control.val()) {
        errors.push($this_el.data('empty-format'));
      }

      if (!$module_control.val() && !this.module_id.length) {
        errors.push($this_el.data('empty-module'));
      }

      $message.html(_.last(errors)).show();
    }
  },

  reset_form: function() {
    var $this_el = $(this.el)
    $this_el.find('form')[0].reset();
    $this_el.find('select').val('').trigger("chosen:updated");
    this.clear_control('fields');
    this.clear_control('forms');
    this.$forms_selector.hide();
    this.$fields_selector.hide();
    $this_el.find('.user_select_fields').hide();
    $this_el.find('.message').empty().hide();
    this.password_control.val("");
  },

  //Hack: In order to prevent the browser allow the user save password we are using the MaskedPassword
  //which create a hidden field that is supposed to hold the value of the password.
  //So, we tried to reach the hidden field first other than that we reach the regular field.
  _create_password_field: function() {
    //Create the hidden field for the password.
    var passEL = $(this.el).find("#password-field");
    if (passEL.length > 0) {
      return new MaskedPassword(passEL.get(0));
    }
    return null;
  }
});