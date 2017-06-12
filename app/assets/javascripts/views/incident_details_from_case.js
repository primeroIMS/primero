_primero.Views.IncidentDetailsFromCase = _primero.Views.Base.extend({
  el: 'body',

  events: {
    'click #incident_details_from_case_button' : 'populate_modal'
  },

  populate_modal: function(event) {
    var self = this;
    event.preventDefault();
    var selected_records = _primero.indexTable.get_selected_records();
    if (selected_records.length === 1) {
      $('#number_of_cases_error').remove();
      var create_incident_details_url = '/cases/' + selected_records[0] + '/create_incident_details';
      $.get(create_incident_details_url, {uuid: 'test'}, function(response) {
        if (response) {
          // TODO: get date of birth and age fields to match in this form
          $(self.el).find('#incident-details-modal .incident_details_container').html(response);
          _primero.chosen('#incident-details-modal form select');
          _primero.populate_select_boxes();
          // to get foundation validation to run on new form
          $('#incident-details-modal form').foundation();
          $('#incident-details-modal').foundation('open');
          $('#incident-details-modal form #nested_incident_details_subform_child_incident_details_template_cp_incident_perpetrator_date_of_birth').change(function(event) {
            _primero.update_age(event);
          });
          $('#incident-details-modal form #nested_incident_details_subform_child_incident_details_template_cp_incident_perpetrator_age').change(function(event) {
            _primero.update_date(event);
          });
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