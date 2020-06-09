_primero.Views.IncidentDetailsFromCase = _primero.Views.Base.extend({
  el: 'body',

  events: {
    'click #incident_details_from_case_button' : 'populate_modal',
    'click #services_section_from_case_button' : 'populate_modal',
    'click #services_section_from_case_button_submit' : 'submit_form_services_modal',
    'click .create_subform_submit': 'submit_form'
  },

  submit_form: function(event) {
    event.preventDefault();

    var form = $(event.target).parents('form');

    _primero.loading_screen_indicator('show');
    form.on("forminvalid.zf.abide", function (ev, el) {
      _primero.loading_screen_indicator('hide');
    });

    $('html').attr('style', '');

    form.append('<input type="hidden" name="redirect_to" value="' + window.location.href + '" />');
    form.submit();
  },

  submit_form_services_modal: function(event) {
    event.preventDefault();

    var form = $(event.target).parents('form');
    var self = this;

    form.on("forminvalid.zf.abide", function(ev, el) {
      form.find('.callout').show();
    });

    form.on("formvalid.zf.abide", function(ev, frm) {
      form.find('.callout').hide();

      _primero.loading_screen_indicator('show');

      $.ajax({
        url: form.attr('action'),
        method: 'PUT',
        data: form.serialize(),
        dataType: 'json',
        success: function() {
          _primero.loading_screen_indicator('hide');
          self.populate_modal(event)
        }
      })
    });

    form.foundation('validateForm');
  },

  populate_modal: function(event) {
    event.preventDefault();
    var self = this;
    var form_type = $(event.currentTarget).data('form-type');
    var form_id = $(event.currentTarget).data('form-id');
    var form_sidebar_id = $(event.currentTarget).data('form-sidebar-id');
    var selected_records = _primero.indexTable.get_selected_records();
    if (selected_records.length === 1) {
      $('#number_of_cases_error').remove();
      var create_subform_url = '/cases/' + selected_records[0] + '/create_subform';
      $.get(create_subform_url, {form_type: form_type, form_id: form_id, form_sidebar_id: form_sidebar_id}, function(response) {
        if (response) {
          // TODO: get date of birth and age fields to match in this form
          $(self.el).find('#' + form_type + '_modal .' + form_type + '_container').html(response);
          _primero.chosen('#' + form_type + '_modal form select');
          _primero.populate_select_boxes();


          var $form = $('#' + form_type + '_modal form')
          var $service_select = $form.find('select[id$="service_type"]');
          var $agency_select = $form.find('select[id$="service_implementing_agency"]');
          var $location_select = $form.find('select[id$="service_delivery_location"]');
          var $user_select = $form.find('select[id$="service_implementing_agency_individual"]');
          var $location_select_boxes = $form.find('select[data-populate="Location"]');

          var location_select_id = "#" + $location_select.attr('id');
          new _primero.Views.PopulateReportingLocationSelectBoxes({ el: location_select_id }).initAutoComplete($location_select);

          var location_select_box_id = "#" + $location_select_boxes.attr('id');
          new _primero.Views.PopulateLocationSelectBoxes({ el: location_select_box_id }).initAutoComplete($location_select_boxes);

          var user_select_id = "#" + $user_select.attr('id');
          new _primero.Views.PopulateUserSelectBoxes({ el: user_select_id }).initAutoComplete($user_select);

          var agency_select_id = "#" + $agency_select.attr('id');
          new _primero.Views.PopulateAgencySelectBoxes({ el: agency_select_id }).initAutoComplete($agency_select);


          // to get foundation validation to run on new form
          $('#' + form_type + '_modal form').foundation();
          $('#' + form_type + '_modal').foundation('open');
          $('#' + form_type + '_modal form input[id$="_date_of_birth"]').change(function(event) {
            _primero.update_age(event);
          });
          $('#' + form_type + '_modal form input[id$="_age"]').change(function(event) {
            _primero.update_date(event);
          });

          $service_select.change(function(event) {
            self.on_service_change(event);
          });

          $agency_select.change(function(event) {
            self.on_agency_change(event);
          });

          $location_select.change(function(event) {
            self.on_filter_change(event);
          });

          $user_select.change(function(event) {
            self.on_user_change(event);
          });

          _primero.init_autosize($('#' + form_type + '_modal').find('textarea'));
        }
      });
    } else {
      $('.error').remove();
      $('.page_container').prepend(JST['templates/error_message']({
        error_id: 'number_of_cases_error',
        error_message: 'child.messages.create_details_error'
      }));
    }
  },

  on_service_change: function(e) {
    var $form = $(e.target).parents('form');
    this.set_agency_filters($form);
    this.set_user_filters($form);
    this.clear_user_selection($form);
    this.clear_agency_selection($form);
  },

  on_filter_change: function(e){
    var $form = $(e.target).parents('form');
    this.set_user_filters($form);
    this.clear_user_selection($form);
  },

  on_user_change: function(e) {
    var self = this;
    var $user_select = $(e.target);
    var selected_user_name = $user_select.val();

    if (selected_user_name) {
      var selected_user = _primero.populated_user_collection.get_by_user_name(selected_user_name);

      if(selected_user){
        var $form = $user_select.parents('form');
        self.populate_agency_filter($form, selected_user.organization);
        self.populate_location_filter($form, selected_user.reporting_location_code);
      }
    }
  },

  on_agency_change: function(e) {
    var $agency_select = $(e.target);
    var $form = $agency_select.parents('form');
    $agency_select.data('value', $agency_select.val());
    this.set_user_filters($form);
    this.clear_user_selection($form);
  },

  populate_location_filter: function($form, location_code,  onComplete) {
    var self = this;
    var $location_select = $form.find('select[id$="service_delivery_location"]');
    $location_select.data('value', location_code);
    _primero.populate_reporting_location_select_boxes($location_select, function() {
      /*
       * We select the value only if exists or empty, otherwise it will be null
       * resulting in the value not being sent to the server.
       */
      if (self.has_option_value($location_select, location_code)) {
        $location_select.val(location_code);

      } else {
        $location_select.val('')
      }
      $location_select.trigger("chosen:updated");
      self.set_user_filters($form);

      if(onComplete){
        onComplete();
      }
    });
  },

  populate_agency_filter: function($form, agency_id, onComplete) {
    var self = this;
    self.set_agency_filters($form);
    var $agency_select = $form.find('select[id$="service_implementing_agency"]');
    $agency_select.data('value', agency_id);
    _primero.populate_agency_select_boxes($agency_select, function() {
      /*
       * We select the value only if exists or empty, otherwise it will be null,
       * resulting in the value not being sent to the server.
       */
      if (self.has_option_value($agency_select, agency_id)) {
        $agency_select.val(agency_id);
      } else {
        $agency_select.val('')
      }
      $agency_select.trigger('chosen:updated');
      self.set_user_filters($form);

      if(onComplete) {
        onComplete();
      }
    });
  },

  set_user_filters: function($form) {
    var $service_select = $form.find('select[id$="service_type"]');
    var $agency_select = $form.find('select[id$="service_implementing_agency"]');
    var $location_select = $form.find('select[id$="service_delivery_location"]');

    var $user_select = $form.find('select[id$="service_implementing_agency_individual"]');
    //Reset the selected value when filters change.
    $user_select.data('value', '');
    $user_select.data('filter-service', $service_select.val());
    $user_select.data('filter-agency', $agency_select.val());
    $user_select.data('filter-location', $location_select.val());
  },

  set_agency_filters: function($form) {
    var $service_select = $form.find('select[id$="service_type"]');
    var $agency_select = $form.find('select[id$="service_implementing_agency"]');

    $agency_select.data('filter-service-type', $service_select.val());
    $agency_select.data('value','');
  },

  clear_user_selection: function($form) {
    var $user_select = $form.find('select[id$="service_implementing_agency_individual"]');
    this.clear_selection($user_select);
  },

  clear_agency_selection: function($form) {
    var $agency_select = $form.find('select[id$="service_implementing_agency"]');
    this.clear_selection($agency_select);
  },

  clear_selection: function($select) {
    $select.empty();
    $select.html('<option value=""></option>');
    $select.trigger('change');
    $select.trigger('chosen:updated')
  },

  has_option_value: function($select_box, value) {
    return $select_box.find('option[value="'+value+'"]').length > 0;
  }
});
