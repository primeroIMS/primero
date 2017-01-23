_primero.Views.CopyRole = _primero.Views.Base.extend({

  el: '.side-tab-content',

  events: {
    'click a.copy-role-action' : 'copy_form',
    'click div#copy-role-modal input[type="submit"]' : 'submit_copy'
  },

  copy_form: function(e) {
    e.preventDefault();
    var id = $(e.target).data('role-id'),
        copy_url = '/roles/'+id+'/copy';
    $('#copy-role-modal form').attr('action', copy_url);
    $('#copy-role-modal').foundation('reveal', 'open')
  },

  submit_copy: function(e) {
    e.preventDefault();
    $(e.target).parents('form').submit();
    $('#copy-role-modal').foundation('reveal', 'close');
    $('#copy-role-modal form')[0].reset();
    window.disable_loading_indicator = true;
  }
});