var Actions = Backbone.View.extend({
  el: 'body',

  events: {
    'click #enable_disable_action': 'enable_disable'
  },

  enable_disable: function(evt) {
    evt.preventDefault();

    var target = $(evt.target),
        id = target.data('id'),
        form_action = target.data('form_action'),
        redirect_url = target.data('request_url'),
        record_state = target.data('state'),
        flag_error_message = target.data('submit_error_message');

    $.post(form_action,
      {
        'redirect_url': redirect_url,
        'record_state': record_state,
        'id': id
      },
      function(response){
        if(response.success) {
          location.reload(true);
        } else {
          alert(response.error_message);
          if(response.reload_page) {
            location.reload(true);
          }
        }
      }
    );
  }
});

$(document).ready(function() {
  new Actions();
});