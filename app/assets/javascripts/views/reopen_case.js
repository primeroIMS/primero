_primero.Views.ReopenCase = Backbone.View.extend({
  el: '[id$="_reopen_records"]',

  events: {
    'click #reopen_action': 'reopen_case'
  },

  reopen_case: function(evt) {
    evt.preventDefault();

    var $target = this.$(evt.target),
      id = $target.data('id'),
      form_action = $target.data('form_action'),
      child_status = $target.data('status'),
      case_reopened = $target.data('reopen'),
      flag_error_message = $target.data('submit_error_message');

    $.post(form_action,
      {
        'child_id': id,
        'child_status': child_status,
        'case_reopened': case_reopened
      },
      function (response) {
        if (response.success) {
          location.reload(true);
        } else {
          alert(response.error_message);
          if (response.reload_page) {
            location.reload(true);
          }
        }
      }
    );
  }
});