_primero.Views.CopyRole = _primero.Views.Base.extend({

  el: '.side-tab-content',

  events: {
    'click .copy-role-action' : 'copy_form',
    'click #copy-role-modal input[type="submit"]' : 'submit_copy'
  },

  copy_form: function(e) {
    e.preventDefault();
    var id = $(e.target).data('role-id'),
        copy_url = '/roles/'+id+'/copy';
    var $copy_role_modal = $('#copy-role-modal');
    $copy_role_modal.find('form').attr('action', copy_url);
    $copy_role_modal.foundation('open')
  },

  submit_copy: function(e) {
    e.preventDefault();
    $(e.target).parents('form').submit();
    var $copy_role_modal = $('#copy-role-modal');
    $copy_role_modal.foundation('close');
    $copy_role_modal.find('form')[0].reset();
    window.disable_loading_indicator = true;
  }
});
