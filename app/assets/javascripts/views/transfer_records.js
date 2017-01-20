_primero.Views.TransferRecords = Backbone.View.extend({

  el: 'body',

  events: {
    'click a.transfer_index_action' : 'transfer_records',
    'change #transfer-modal input[name="is_remote"]' : 'toggle_remote_primero',
    'change #transfer-modal select#existing_user' : 'toggle_other_user',
    'change #transfer-modal input#other_user' : 'toggle_existing_user',
    'click #transfer-modal input[type="submit"]' : 'close_transfer'
  },

  transfer_records: function(event) {
    var selected_recs = _primero.indexTable.get_selected_records(),
      $transfer_button = $(event.target),
      consent_url = $transfer_button.data('consent_count_url');
    $("#transfer-modal").find("#selected_records").val(selected_recs);

    $.get( consent_url, {selected_records: selected_recs.join(","), transition_type: "transfer"}, function(response) {
      var total = response['record_count'],
        consent_cnt = response['consent_count'],
        no_consent_cnt = total - consent_cnt;
      $("#transfer-modal").find("span.consent_count").replaceWith(no_consent_cnt.toString());
    });
  },

  toggle_remote_primero: function() {
    var $transfer_modal = $('#transfer-modal');
    $transfer_modal.find('div.remote_toggle').toggle();
    $transfer_modal.find('div.local_toggle').toggle();
  },

  toggle_other_user: function(e) {
    var existing_user = $(e.target).val(),
      $other_user_input = $('#transfer-modal').find('#other_user'),
      $other_user_agency_input = $('#transfer-modal').find('#other_user_agency');
    if (existing_user == null || existing_user == undefined || existing_user.trim() == "") {
      $other_user_input.prop('disabled', false);
      $other_user_agency_input.prop('disabled', false);
    } else {
      $other_user_input.prop('disabled', true);
      $other_user_agency_input.prop('disabled', true);
    }
  },

  toggle_existing_user: function(e) {
    var other_user = $(e.target).val(),
      $existing_user_select = $('#transfer-modal').find('#existing_user');

     if (other_user == null || other_user == undefined || other_user.trim() == "") {
      $existing_user_select.prop('disabled', false);
     } else {
      $existing_user_select.prop('disabled', true);
     }
  },

  close_transfer: function(e) {
    e.preventDefault();
    var password = $('#transfer-modal').find('#password').val(),
      local_user = $('#transfer-modal').find('#existing_user').val(),
      remote_user = $('#transfer-modal').find('#other_user').val(),
      is_remote = $('#transfer-modal').find('#is_remote').prop('checked'),
      $localUserErrorDiv = $("#transfer-modal").find(".local_user_flash"),
      $remoteUserErrorDiv = $("#transfer-modal").find(".remote_user_flash"),
      $passwordErrorDiv = $("#transfer-modal").find(".password_flash"),
      is_valid = true;
    var $transfer_modal = $('#transfer-modal');
    if(is_remote){
      //Require remote user and password
      if(remote_user == null || remote_user == undefined || remote_user.trim() == ""){
        $remoteUserErrorDiv.children(".error").text(I18n.t("transfer.user_mandatory")).css('color', 'red');
        $remoteUserErrorDiv.show();
        is_valid = false;
      }
      if(password == null || password == undefined || password.trim() == ""){
        $passwordErrorDiv.children(".error").text(I18n.t("encrypt.password_mandatory")).css('color', 'red');
        $passwordErrorDiv.show();
        is_valid = false;
      }
    } else {
      //Require local user
      if(local_user == null || local_user == undefined || local_user.trim() == ""){
        $localUserErrorDiv.children(".error").text(I18n.t("transfer.user_mandatory")).css('color', 'red');
        $localUserErrorDiv.show();
        is_valid = false;
      }
    }

    if(is_valid){
      $localUserErrorDiv.hide();
      $remoteUserErrorDiv.hide();
      $passwordErrorDiv.hide();
      $(e.target).parents('form').submit();
      $transfer_modal.foundation('reveal', 'close');
      $transfer_modal.find('form')[0].reset();
      $transfer_modal.find('div.remote_toggle').hide();
      $transfer_modal.find('div.local_toggle').show();
      window.disable_loading_indicator = true;
    } else {
      return false;
    }
  }
});