_primero.Views.RequestApproval = _primero.Views.Base.extend({
  el: '[id$="_approvals"]',

  events: {
    'click #approve_action': 'request_approval'
  },

  request_approval: function(evt) {
    evt.preventDefault();

    var $target = this.$(evt.target),
      id = $target.data('id'),
      form_action = $target.data('form_action'),
      approval_status = $target.data('status'),
      approval_status_type = $target.data('approval_type'),
      approval_type = approval_status_type,
      select = $target.parents('.reveal').find('form select'),
      error_message = $('.reveal .error');

    if (select && select.val() === '') {
      error_message.show();
      return false;
    } else if (select && select.val()) {
      error_message.hide();
      approval_type = select.val();
    }

    $.post(form_action,
      {
        'child_id': id,
        'approval_status': approval_status,
        'approval_type': approval_type,
        'approval_status_type': approval_status_type
      },
      function(response) {
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