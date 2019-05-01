_primero.Views.TransferRecords = _primero.Views.Base.extend({

  el: 'body',

  users_api_url: '/api/users',

  events: {
    'click .transfer_index_action' : 'transfer_records',
    'click .transfer_show_action' : 'transfer_records_empty',
    'change #transfer-modal input[name="is_remote"]' : 'toggle_remote_primero',
    'change #transfer-modal select#existing_user_transfer' : 'toggle_other_user',
    'change #transfer-modal input#other_user' : 'toggle_existing_user',
    'click #transfer-modal input[type="submit"]' : 'close_transfer',
    'change #transfer-modal select#location' : 'on_filter_change',
    'change #transfer-modal select#agency' : 'on_agency_change'
  },

  initialize: function(){
    var self = this;

    $('#transfer-modal').on('closeme.zf.reveal', self.clear_modal)
    self.has_reset_modal = false;
  },

  reset_modal: function() {
    var self = this;
    //Avoid to register this event several times.
    if(!self.has_reset_modal) {
      $("#transfer-modal").on('open.zf.reveal', function() {
        var is_remote = $(this).find('.remote_toggle').is(':visible');
        if(is_remote){
          self.toggle_remote_primero();
        }
      });
      self.has_reset_modal = true;
    }
  },

  transfer_records_empty: function(event){
    var self = this;
    self.reset_modal();
    self.clear_errors();
    self.clear_transfer();
    var $transfer_button = $(event.target)
    self.select_user_location(function(){
      self.set_user_filters();
    });
    self.clear_user_selection();
  },

  transfer_records: function(event) {
    var self = this;
    self.reset_modal();
    self.clear_errors();
    self.clear_transfer();
    var selected_recs = _primero.indexTable.get_selected_records(),
      $transfer_button = $(event.target),
      consent_url = $transfer_button.data('consent_count_url');
    self.select_user_location(function(){
      self.set_user_filters();
    });
    self.clear_user_selection();
    $("#transfer-modal").find("#selected_records").val(selected_recs);

    $.get(consent_url, { selected_records: selected_recs.join(","), transition_type: "transfer" }, function (response) {
      var total = response['record_count'],
        consent_cnt = response['consent_count'],
        no_consent_cnt = total - consent_cnt;
      $("#transfer-modal").find(".consent_count").replaceWith(no_consent_cnt.toString());
    });
  },

  toggle_remote_primero: function () {
    var $transfer_modal = $('#transfer-modal');
    $transfer_modal.find('.remote_toggle').toggle();
    $transfer_modal.find('.local_toggle').toggle();
  },

  toggle_other_user: function (e) {
    var existing_user = $(e.target).val(),
      $other_user_input = $('#transfer-modal').find('#other_user'),
      $other_user_agency_input = $('#transfer-modal').find('#other_user_agency'),
      $other_user_agency_hidden = $('input[name=other_user_agency][type=hidden]');

    if (existing_user == null || existing_user == undefined || existing_user.trim() == "") {
      $other_user_input.prop('disabled', false);
      $other_user_agency_input.prop('disabled', false);
      $other_user_agency_hidden.prop('disabled', false);

    } else {
      $other_user_input.prop('disabled', true);
      $other_user_agency_input.prop('disabled', true);
      $other_user_agency_hidden.prop('disabled', true);
    }
  },

  toggle_existing_user: function (e) {
    var other_user = $(e.target).val(),
      $existing_user_select = $('#transfer-modal').find('#existing_user_transfer');

    if (other_user == null || other_user == undefined || other_user.trim() == "") {
      $existing_user_select.prop('disabled', false);
      $existing_user_select.removeAttr("disabled");
      $existing_user_select.removeAttr("chosen-disabled");
      $existing_user_select.trigger("chosen:updated");
     } else {
      $existing_user_select.prop('disabled', true);
      $existing_user_select.attr("chosen-disabled");
      $existing_user_select.trigger("chosen:updated");
     }
  },

  close_transfer: function (e) {
    e.preventDefault();
    var password = $('#transfer-modal').find('#password').val(),
      local_user = $('#transfer-modal').find('#existing_user_transfer').val(),
      remote_user = $('#transfer-modal').find('#other_user').val(),
      is_remote = $('#transfer-modal').find('#is_remote').prop('checked'),
      $localUserErrorDiv = $("#transfer-modal").find(".local_user_flash"),
      $remoteUserErrorDiv = $("#transfer-modal").find(".remote_user_flash"),
      $passwordErrorDiv = $("#transfer-modal").find(".password_flash"),
      is_valid = true;
    var $transfer_modal = $('#transfer-modal');
    if (is_remote) {
      //Require remote user and password
      if (remote_user == null || remote_user == undefined || remote_user.trim() == "") {
        $remoteUserErrorDiv.children(".error").text(I18n.t("transfer.user_mandatory")).css('color', 'red');
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
        $localUserErrorDiv.children(".error").text(I18n.t("transfer.user_mandatory")).css('color', 'red');
        $localUserErrorDiv.show();
        is_valid = false;
      }
    }

    if (is_valid) {
      $(e.target).parents('form').submit();
      $transfer_modal.foundation('close');
      this.clear_modal();
      $transfer_modal.find('.local_toggle').show();
      window.disable_loading_indicator = true;
    } else {
      return false;
    }
  },

  clear_errors: function() {
    var $transfer_modal = $('#transfer-modal');
    $transfer_modal.find(".local_user_flash").hide();
    $transfer_modal.find(".remote_user_flash").hide();
    $transfer_modal.find(".password_flash").hide();
  },

  clear_transfer: function(){
    var $transfer_modal = $("#transfer-modal");

    var $agency_select = $transfer_modal.find("select#agency");
    $agency_select.val('');
    $agency_select.trigger("chosen:updated");

    var $location_select = $transfer_modal.find("select#location");
    $location_select.val('');
    $location_select.trigger("chosen:updated");

    this.set_user_filters();
  },

  on_filter_change: function() {
    this.set_user_filters();
    this.clear_user_selection();
  },

  on_agency_change: function(e) {
    var $agency_select = $(e.target);
    //Reset the value so we don't lose the selection
    $agency_select.data('value', $agency_select.val());
    this.on_filter_change();
  },

  set_user_filters: function() {
    var $transfer_modal = $("#transfer-modal");
    var $agency_select = $transfer_modal.find("select#agency");
    var $location_select = $transfer_modal.find("select#location");

    var $existing_user_select = $('select#existing_user_transfer');
    $existing_user_select.data('filter-agency', $agency_select.val());
    $existing_user_select.data('filter-location', $location_select.val());
  },

  populate_location_filter: function(location_code, onComplete){
    var $location_select = $("#transfer-modal select#location");
    $location_select.data('value', location_code);
    _primero.populate_reporting_location_select_boxes($location_select, function(){
      $location_select.val(location_code);
      $location_select.trigger("chosen:updated");
      if(onComplete){
        onComplete();
      }
    });
  },

  select_user_location: function(onComplete){
    var $location_select = $("#transfer-modal select#location");
    this.populate_location_filter($location_select.data('current-user-location'), onComplete);
  },

  clear_user_selection: function() {
    var $existing_user_select = $('select#existing_user_transfer');
    $existing_user_select.empty();
    $existing_user_select.html('<option value=""></option>');
    $existing_user_select.trigger('change');
    $existing_user_select.trigger("chosen:updated");
  },

  clear_modal: function () {
    var hideElements = [
      '.local_user_flash',
      '.remote_user_flash',
      '.password_flash',
      '.remote_toggle'
    ]
    var $transfer_modal = $('#transfer-modal')

    $.each(hideElements, function (k, el) {
      $transfer_modal.find(el).hide();
    })

    $transfer_modal.find('form').trigger('reset');
  }
});
