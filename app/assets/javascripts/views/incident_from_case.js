_primero.Views.IncidentFromCase = _primero.Views.Base.extend({
  el: 'body',

  events: {
    'click .create_cp_incident_modal' : 'create_incident'
  },

  create_incident: function(event) {
    event.preventDefault();
    var selected_recs = _primero.indexTable.get_selected_records(),
    $create_incident_button = $(event.target),
    create_incident_url = $create_incident_button[0].getAttribute('href');
    $.get(create_incident_url, {}, function(response) {
      _primero.loading_screen_indicator('hide');
      button_class = $create_incident_button.parents('.reveal').data('button');
      $('#' + button_class).foundation('close');
      $('.' + button_class).replaceWith(JST['templates/incident_link']({
        incident_link_label: response.incident_link_label,
        incident_link: response.incident_link
      }));
    });
  },
});