_primero.Views.FormsExport = Backbone.View.extend({
  el: '[id$="forms-export"]',

  events: {
    'click #forms-export': 'download_all_forms'
  },

  download_all_forms: function(e) {
    e.preventDefault();

    var target = this.$(e.target),
        id = target.data('id'),
        form_action = target.data('form_action');

    console.log("In download_all_forms, JS connected properly");

    // TODO: Figure out how to send this function - whether to send any params here or no?
    $.get(form_action,
      {
        //'type' = 'case',
        //'module' = 'primeromodule-cp',
        //'show_hidden' = false)
        //'child_id': id,
        //'child_status': child_status,
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