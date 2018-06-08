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
          // to get foundation validation to run on new form
          $('#' + form_type + '_modal form').foundation();
          $('#' + form_type + '_modal').foundation('open');
          $('#' + form_type + '_modal form input[id$="_date_of_birth"]').change(function(event) {
            _primero.update_age(event);
          });
          $('#' + form_type + '_modal form input[id$="_age"]').change(function(event) {
            _primero.update_date(event);
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
  }
});