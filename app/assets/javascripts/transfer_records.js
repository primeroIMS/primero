var TransferRecords = Backbone.View.extend({

  el: 'body',

  events: {
    'click a.transfer_index_action' : 'transfer_records',
    'change div#transfer-modal input[name="is_remote"]' : 'toggle_remote_primero',
    'click div#transfer-modal input[type="submit"]' : 'close_transfer'
  },

  transfer_records: function() {
    var selected_records = _primero.indexTable.get_selected_records();
    $("#transfer-modal #selected_records").val(selected_records);
  },

  toggle_remote_primero: function() {
    $('#transfer-modal div.remote_toggle').toggle();
  },

  close_transfer: function(e) {
    e.preventDefault();
    var password = $('input#transfer_password').val(),
        is_remote = $('div#transfer-modal input#is_remote').prop('checked'),
        errorDiv = $("div#transfer-modal .flash");
    //Require a password only if this is a remote transfer
    if(is_remote && (password == null || password == undefined || password.trim() == "")){
      errorDiv.children(".error").text(I18n.t("encrypt.password_mandatory")).css('color', 'red');
      errorDiv.show();
      return false;
    } else {
      errorDiv.hide();
      $(e.target).parents('form').submit();
      $('#transfer-modal').foundation('reveal', 'close');
      $('#transfer-modal form')[0].reset();
      $('#transfer-modal div.remote_toggle').hide();
      window.disable_loading_indicator = true;
    }
  }
});

$(document).ready(function() {
  new TransferRecords();
});
