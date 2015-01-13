var ReferRecords = Backbone.View.extend({

  el: 'body',

  events: {
    'click a.referral_index_action' : 'refer_records',
    'change div#referral-modal input[name="is_remote"]' : 'toggle_remote_primero',
    'click div#referral-modal input[type="submit"]' : 'close_referral'
  },

  refer_records: function() {
    var selected_records = _primero.indexTable.get_selected_records();
    $("#referral-modal #selected_records").val(selected_records);
  },

  toggle_remote_primero: function(e) {
    $('#referral-modal div.remote_toggle').toggle();
  },

  close_referral: function(e) {
    e.preventDefault();
    var password = $('input#referral_password').val(),
        is_remote = $('div#referral-modal input#is_remote').prop('checked'),
        errorDiv = $("div#referral-modal .flash");
    //Require a password only if this is a remote referral
    if(is_remote && (password == null || password == undefined || password.trim() == "")){
      errorDiv.children(".error").text(I18n.t("encrypt.password_mandatory")).css('color', 'red');
      errorDiv.show();
      return false;
    } else {
      errorDiv.hide();
      $(e.target).parents('form').submit();
      $('#referral-modal').foundation('reveal', 'close');
      $('#referral-modal form')[0].reset();
      $('#referral-modal div.remote_toggle').hide();
      window.disable_loading_indicator = true;
    }
  }
});

$(document).ready(function() {
  new ReferRecords();
});
