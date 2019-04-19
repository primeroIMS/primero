_primero.Views.ReferRecords = _primero.Views.Base.extend({

  el: 'body',

  events: {
    'click .service_referral_button': 'refer_from_service',
    'click .referral_index_action': 'refer_records',
    'click .referral_show_action': 'refer_records_empty',
    'change #referral-modal input[name="is_remote"]': 'toggle_remote_primero',
    'change #referral-modal select#existing_user': 'toggle_other_user',
    'change #referral-modal input#other_user': 'toggle_existing_user',
    'click #referral-modal input[type="submit"]': 'close_referral'
  },

  initialize: function () {
    var self = this;

    $('#referral-modal').on('closeme.zf.reveal', self.clear_modal)
  },

  refer_records_empty: function (event) {
    this.clear_referral();
    $("#referral-modal").find("#service_hidden").attr("disabled", "disabled");
    $("#referral-modal").find("#existing_user_hidden").attr("disabled", "disabled");
  },

  refer_records: function (event) {
    this.clear_referral();
    var selected_recs = _primero.indexTable.get_selected_records(),
      $referral_button = $(event.target),
      consent_url = $referral_button.data('consent_count_url');
    $("#selected_records").val(selected_recs);
    this.refer_records_empty();
    $.get(consent_url, { selected_records: selected_recs.join(","), transition_type: "referral" }, function (response) {
      var total = response['record_count'],
        consent_cnt = response['consent_count'],
        no_consent_cnt = total - consent_cnt;
      $("#referral-modal").find(".consent_count").html(no_consent_cnt.toString());
    });
  },

  refer_from_service: function (event) {
    this.clear_referral();
    var $referral_button = $(event.target);
    var service_type = $referral_button.data('service-type');
    var service_user_name = $referral_button.data('service-user-name');
    var service_object_id = $referral_button.data('service-object-id');
    var $referral_modal = $("#referral-modal");
    $referral_modal.find("#service_hidden").val(service_type);
    var $service_type = $referral_modal.find("#service");
    $service_type.val(service_type);
    $service_type.not("[type='hidden']").attr("disabled", "disabled");
    $referral_modal.find("#existing_user_hidden").val(service_user_name);
    var $existing_user_select = $referral_modal.find("#existing_user");
    $existing_user_select.val(service_user_name);
    $existing_user_select.attr("disabled", "disabled");
    $existing_user_select.trigger("chosen:updated");
    $referral_modal.find("#service_object_id").val(service_object_id);
  },

  toggle_remote_primero: function () {
    var $referral_modal = $('#referral-modal');
    $referral_modal.find('.remote_toggle').toggle();
    $referral_modal.find('.local_toggle').toggle();
  },

  toggle_other_user: function (e) {
    var existing_user = $(e.target).val(),
      $other_user_input = $('#other_user'),
      $other_user_agency_input = $('#other_user_agency');
    if (existing_user == null || existing_user == undefined || existing_user.trim() == "") {
      $other_user_input.prop('disabled', false);
      $other_user_agency_input.prop('disabled', false);
    } else {
      $other_user_input.prop('disabled', true);
      $other_user_agency_input.prop('disabled', true);
    }
  },

  toggle_existing_user: function (e) {
    var other_user = $(e.target).val(),
      $existing_user_select = $('#existing_user');

    if (other_user == null || other_user == undefined || other_user.trim() == "") {
      $existing_user_select.prop('disabled', false);
    } else {
      $existing_user_select.prop('disabled', true);
    }
  },

  clear_referral: function (e) {
    var $referral_modal = $("#referral-modal");
    $referral_modal.find("#service").removeAttr("disabled");
    $referral_modal.find("#service_hidden").removeAttr("disabled");
    $referral_modal.find("#existing_user_hidden");
    var $existing_user_select = $referral_modal.find("#existing_user");
    $existing_user_select.removeAttr("disabled");
    $existing_user_select.removeAttr("chosen-disabled");
    $existing_user_select.trigger("chosen:updated");
  },

  close_referral: function (e) {
    e.preventDefault();
    var $referral_modal = $('#referral-modal');
    var password = $referral_modal.find('#password').val();
    var local_user = $referral_modal.find("#existing_user").val();
    var remote_user = $referral_modal.find('#other_user').val();
    var is_remote = $referral_modal.find('#is_remote').prop('checked');
    var $localUserErrorDiv = $referral_modal.find(".local_user_flash");
    var $remoteUserErrorDiv = $referral_modal.find(".remote_user_flash");
    var $passwordErrorDiv = $referral_modal.find(".password_flash");
    var is_valid = true;
    if (is_remote) {
      //Require remote user and password
      if (remote_user == null || remote_user == undefined || remote_user.trim() == "") {
        $remoteUserErrorDiv.children(".error").text(I18n.t("referral.user_mandatory")).css('color', 'red');
        $remoteUserErrorDiv.show();
        is_valid = false;
      }
      if (password == null || password == undefined || password.trim() == "") {
        $passwordErrorDiv.children(".error").text(I18n.t("encrypt.password_mandatory")).css('color', 'red');
        $passwordErrorDiv.show();
        is_valid = false;
      }
    } else {
      //Require local user
      if (local_user == null || local_user == undefined || local_user.trim() == "") {
        $localUserErrorDiv.children(".error").text(I18n.t("referral.user_mandatory")).css('color', 'red');
        $localUserErrorDiv.show();
        is_valid = false;
      }
    }
    if (is_valid) {
      $(e.target).parents('form').submit();
      $referral_modal.foundation('close');
      this.clear_modal();
      $referral_modal.find('.local_toggle').show();
      window.disable_loading_indicator = true;
    } else {
      return false;
    }
  },

  clear_modal: function () {
    var hideElements = [
      '.local_user_flash',
      '.remote_user_flash',
      '.password_flash',
      '.remote_toggle'
    ]
    var $referral_modal = $('#referral-modal')

    $.each(hideElements, function (k, el) {
      $referral_modal.find(el).hide();
    })

    $referral_modal.find('form').trigger('reset');
  }

});
