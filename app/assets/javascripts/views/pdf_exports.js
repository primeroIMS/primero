_primero.Views.PdfExports = _primero.Views.Base.extend({
  el: '#pdf-exports',

  events: {
    'change select[name="module"]' : 'set_form_state',
    'click #submit_export': 'submit_export_request'
  },

  initialize: function() {
    var self = this;
    var $this_el = $(this.el);

    this.$forms_selector = $('fieldset.pdf_export_form');
    this.record_type = $this_el.data('record-type');
    this.module_id = $this_el.data('module-id');
    this.record_id = $this_el.data('record-id');
    this.model_class = $this_el.data('model-class');
    // TODO - tighten this up
    this.filter_type = 'case_pdf';

    this.init_chosen_fields();

    this.password_control = this._create_password_field();

    if (this.module_id) {
      var $select_module = $this_el.find('select[name="module"]');
      var $mod_select = $this_el.find('.module_select');
      $select_module.hide();
      $select_module.prev().hide();
      $mod_select.hide();
    }

    function reset_form() {
      self.reset_form();
    }
    $(document).on('closed.zf.reveal', '#pdf-exports', reset_form);
  },

  init_chosen_fields: function() {
    var self = this;

    self.set_form_state();

    $('select[name="forms"]').chosen();
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
    var $module_selector = $(this.el).find('select[name="module"]');

    if ($module_selector.val() || this.module_id) {
      this.retrieve_form_names();
    }
  },

  clear_control: function() {
    $select_control = this.$forms_selector.find('select');
    $select_control.empty();
    $select_control.trigger('chosen:updated');
  },

  retrieve_form_names: function() {
    this.toggle_loading_indicator('show');

    var self = this,
      $module_control = $(this.el).find('select[name="module"]'),
    data = {
      record_type: this.record_type,
      module: $module_control.val() || this.module_id
    };

    $.get('/custom_exports/permitted_forms_list', data, function(res) {
      var $select_control = $('#pdf-exports').find('select[name="forms"]');

      self.clear_control();

      var select_options = [];

      _.each(res, function(form) {
        var select_option = '<option value="' + form.id + '">'+ form.name + '</option>';
        select_options.push(select_option);
      });

      $select_control.html(select_options.join(''));

      $select_control.trigger("chosen:updated");
      self.toggle_loading_indicator('hide');
    });
  },

  submit_export_request: function(e) {
    e.preventDefault();

    var $this_el = $(this.el);
    var password_control = this.password_control,
        $module_control = $this_el.find('select[name="module"]'),
        $filename_control = $this_el.find('#export-filename'),
        $forms_control = $this_el.find('select[name="forms"]'),
        $message = $this_el.find('.message'),
        subforms = [],
        forms = [];

    for(var i = 0; i < $forms_control.val().length; i++){
      var val = $forms_control.val()[i];
      if (val.indexOf('subf:') == 0) {
        var vals = val.split(':');
        subforms.push(vals[1]);
      } else {
        forms.push(val);
      }
    }

    if (password_control.val() &&
        $forms_control.val() &&
        ($module_control.val() || this.module_id.length)) {

      var data = {
        custom_export_file_name: $filename_control.val(),
        password: password_control.val(),
        selected_records: _primero.indexTable.get_selected_records().join(","),
        custom_exports: {
          record_id: this.record_id,
          record_type: this.record_type,
          module:  $module_control.val() || this.module_id,
          forms: forms,
          selected_subforms: subforms,
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
      _primero.check_download_status();
      window.location = file_location;
    } else {

      var errors = [];

      if (!password_control.val()) {
        errors.push($this_el.data('empty-password'));
      }

      // TODO - revisit this!!!
      if (!$forms_control.val() ) {
        errors.push($this_el.data('empty-fields-forms'));
      }

      if (!$module_control.val() && !this.module_id.length) {
        errors.push($this_el.data('empty-module'));
      }

      $message.html(_.last(errors)).show();
    }
  },

  reset_form: function() {
    var $this_el = $(this.el);
    $this_el.find('form')[0].reset();
    $this_el.find('select').val('').trigger("chosen:updated");
    $this_el.find('.message').empty().hide();
    this.password_control.val("");
  },

  //Hack: In order to prevent the browser allow the user save password we are using the MaskedPassword
  //which create a hidden field that is supposed to hold the value of the password.
  //So, we tried to reach the hidden field first other than that we reach the regular field.
  _create_password_field: function() {
    //Create the hidden field for the password.
    var $pass_eL = $(this.el).find("#password-field");
    if ($pass_eL.length > 0) {
      return new MaskedPassword($pass_eL.get(0));
    }
    return null;
  }
});