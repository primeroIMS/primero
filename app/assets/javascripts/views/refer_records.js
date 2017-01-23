_primero.Views.ReferRecords = _primero.Views.Base.extend({

  el: 'body',

  events: {
    'click a.referral_index_action' : 'refer_records',
    'change div#referral-modal input[name="is_remote"]' : 'toggle_remote_primero',
    'change div#referral-modal select#existing_user' : 'toggle_other_user',
    'change div#referral-modal input#other_user' : 'toggle_existing_user',
    'click div#referral-modal input[type="submit"]' : 'close_referral'
  },

  refer_records: function(event) {
    var selected_recs = _primero.indexTable.get_selected_records(),
        referral_button = $(event.target),
        consent_url = referral_button.data('consent_count_url');
    $("#referral-modal #selected_records").val(selected_recs);
    $.get( consent_url, {selected_records: selected_recs.join(","), transition_type: "referral"}, function(response) {
        var total = response['record_count'],
            consent_cnt = response['consent_count'],
            no_consent_cnt = total - consent_cnt;
        $("#referral-modal span.consent_count").replaceWith(no_consent_cnt.toString());
    });
  },

  toggle_remote_primero: function() {
    $('#referral-modal div.remote_toggle').toggle();
    $('#referral-modal div.local_toggle').toggle();
  },

  toggle_other_user: function(e) {
    var existing_user = $(e.target).val(),
        other_user_input = $('#referral-modal input#other_user'),
        other_user_agency_input = $('#referral-modal input#other_user_agency');
    if(existing_user == null || existing_user == undefined || existing_user.trim() == ""){
      other_user_input.prop('disabled', false);
      other_user_agency_input.prop('disabled', false);
    } else {
      other_user_input.prop('disabled', true);
      other_user_agency_input.prop('disabled', true);
    }
  },

  toggle_existing_user: function(e) {
    var other_user = $(e.target).val(),
        existing_user_select = $('#referral-modal select#existing_user');

     if(other_user == null || other_user == undefined || other_user.trim() == ""){
      existing_user_select.prop('disabled', false);
     } else {
      existing_user_select.prop('disabled', true);
     }
  },

  close_referral: function(e) {
    e.preventDefault();
    var password = $('div#referral-modal input#password').val(),
        local_user = $('div#referral-modal select#existing_user').val(),
        remote_user = $('div#referral-modal input#other_user').val(),
        is_remote = $('div#referral-modal input#is_remote').prop('checked'),
        localUserErrorDiv = $("div#referral-modal .local_user_flash"),
        remoteUserErrorDiv = $("div#referral-modal .remote_user_flash"),
        passwordErrorDiv = $("div#referral-modal .password_flash"),
        is_valid = true;
    if(is_remote){
      //Require remote user and password
      if(remote_user == null || remote_user == undefined || remote_user.trim() == ""){
        remoteUserErrorDiv.children(".error").text(I18n.t("referral.user_mandatory")).css('color', 'red');
        remoteUserErrorDiv.show();
        is_valid = false;
      }
      if(password == null || password == undefined || password.trim() == ""){
        passwordErrorDiv.children(".error").text(I18n.t("encrypt.password_mandatory")).css('color', 'red');
        passwordErrorDiv.show();
        is_valid = false;
      }
    } else {
      //Require local user
      if(local_user == null || local_user == undefined || local_user.trim() == ""){
        localUserErrorDiv.children(".error").text(I18n.t("referral.user_mandatory")).css('color', 'red');
        localUserErrorDiv.show();
        is_valid = false;
      }
    }

    if(is_valid){
      localUserErrorDiv.hide();
      remoteUserErrorDiv.hide();
      passwordErrorDiv.hide();
      $(e.target).parents('form').submit();
      $('#referral-modal').foundation('reveal', 'close');
      $('#referral-modal form')[0].reset();
      $('#referral-modal div.remote_toggle').hide();
      $('#referral-modal div.local_toggle').show();
      window.disable_loading_indicator = true;
    } else {
      return false;
    }
  }
});
