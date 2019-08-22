_primero.Views.ReferRecords = _primero.Views.Base.extend({

  el: 'body',

  events: {
    'click .service_referral_button' : 'refer_from_service',
    'click .referral_index_action' : 'refer_records',
    'click .referral_show_action' : 'refer_records_empty',
    'change #referral-modal input[name="is_remote"]' : 'toggle_remote_primero',
    'change #referral-modal select#existing_user_referral' : 'on_user_change',
    'change #referral-modal input#other_user' : 'toggle_existing_user',
    'click #referral-modal input[type="submit"]' : 'close_referral',
    'change #referral-modal select#service' : 'on_service_change',
    'change #referral-modal select#agency' : 'on_agency_change',
    'change #referral-modal select#location' : 'on_location_change',
  },

  initialize: function(){
    var self = this;
    $('#referral-modal').on('closeme.zf.reveal', self.clear_modal)
    self.collection = new _primero.Collections.UsersCollection();
    self.has_reset_modal = false;
  },

  reset_modal: function() {
    var self = this;
    //Avoid to register this event several times.
    if(!self.has_reset_modal) {
      $("#referral-modal").on('open.zf.reveal', function() {
        var is_remote = $(this).find('.remote_toggle').is(':visible');
        if(is_remote){
          self.toggle_remote_primero();
        }
      });
      self.has_reset_modal = true;
    }
  },

  refer_records_empty: function(event) {
    var self = this;
    this.reset_modal();
    this.clear_referral();
    this.clear_errors();
    var $referral_modal = $("#referral-modal");
    $referral_modal.find("#service_hidden").attr("disabled","disabled");
    $referral_modal.find("#existing_user_hidden").attr("disabled","disabled");

    var $referral_button = $(event.target);
    self.select_user_location(function(){
      self.clear_user_selection();
      self.set_user_filters();
    });
  },

  refer_records: function (event) {
    this.clear_referral();
    var selected_recs = _primero.indexTable.get_selected_records(),
      $referral_button = $(event.target),
      consent_url = $referral_button.data('consent_count_url');
    $("#selected_records").val(selected_recs);
    this.refer_records_empty(event);
    $.get( consent_url, {selected_records: selected_recs.join(","), transition_type: "referral"}, function(response) {
        var total = response['record_count'],
            consent_cnt = response['consent_count'],
            no_consent_cnt = total - consent_cnt;
        $("#referral-modal").find(".consent_count").html(no_consent_cnt.toString());
    });
  },

  refer_from_service: function(event) {
    var self = this;
    self.reset_modal();
    self.clear_referral();
    self.clear_user_selection();
    self.disable_remote_fields();
    self.clear_errors();

    var $referral_button = $(event.target);
    var service_type = $referral_button.data('service-type');
    var service_user_name = $referral_button.data('service-user-name');
    var service_object_id = $referral_button.data('service-object-id');
    var service_agency = $referral_button.data('service-agency');
    var service_delivery_location = $referral_button.data('service-delivery-location');

    var $referral_modal = $("#referral-modal");
    // Make sure the modal is opened when we are in the service form, so that we can change
    // the values of the fields.
    $referral_modal.foundation('open');
    $referral_modal.find("#service_hidden").val(service_type);
    var $service_type = $referral_modal.find("#service");
    $service_type.val(service_type);
    $service_type.attr("disabled","disabled");
    $service_type.trigger("chosen:updated");
    $service_type.not("[type='hidden']").attr("disabled","disabled");
    $referral_modal.find("#existing_user_hidden").val(service_user_name);

    $referral_modal.find("#agency_hidden").val(service_agency);
    var $agency_select = $referral_modal.find("select#agency");
    $agency_select.attr("disabled","disabled");
    $agency_select.trigger("chosen:updated");

    var $location_select = $referral_modal.find("select#location");
    $location_select.attr("disabled", "disabled");
    $location_select.trigger("chosen:updated");

    var $existing_user_select = $referral_modal.find("#existing_user_referral");
    $existing_user_select.attr("disabled","disabled");
    $existing_user_select.trigger("chosen:updated");

    self.set_user_filters();

    if(service_user_name) {
      _primero.populate_user_select_boxes($existing_user_select, function(){
        $existing_user_select.val(service_user_name);
        $existing_user_select.trigger("chosen:updated");
        var user = _primero.populated_user_collection.get_by_user_name(service_user_name);
        var agency = service_agency ? service_agency : user.organization;
        var location = service_delivery_location ? service_delivery_location : user.reporting_location_code;
        self.populate_location_filter(location);
        self.populate_agency_filter(agency);
      })
    }

    $referral_modal.find("#service_object_id").val(service_object_id);
  },

  toggle_remote_primero: function() {
    var $referral_modal = $('#referral-modal');
    $referral_modal.find('.remote_toggle').toggle();
    $referral_modal.find('.local_toggle').toggle();
  },

  toggle_other_user: function (e) {
    var existing_user = $(e.target).val(),
      $other_user_input = $('#other_user'),
      $other_user_agency_input = $('#other_user_agency'),
      $other_user_agency_hidden = $('input[name=other_user_agency][type=hidden]');

    if(existing_user == null || existing_user == undefined || existing_user.trim() == ""){
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
      $existing_user_select = $("#existing_user_referral");
      $existing_user_hidden = $("#existing_user_hidden");

     if(other_user == null || other_user == undefined || other_user.trim() == ""){
      $existing_user_hidden.prop("disabled", false);
      $existing_user_select.prop("disabled", false);
      $existing_user_select.removeAttr("disabled");
      $existing_user_select.removeAttr("chosen-disabled");
      $existing_user_select.trigger("chosen:updated");

     } else {
      $existing_user_hidden.prop("disabled", true);
      $existing_user_select.prop('disabled', true);
      $existing_user_select.attr("chosen-disabled");
      $existing_user_select.trigger("chosen:updated");
     }
  },

  clear_referral: function (e) {
    var $referral_modal = $("#referral-modal");
    var $service_select = $referral_modal.find("#service")
    $service_select.removeAttr("disabled");
    $service_select.val('');
    $service_select.trigger("chosen:updated");
    $referral_modal.find("#service_hidden").removeAttr("disabled");

    var $agency_select = $referral_modal.find("#agency");
    $agency_select.removeAttr("disabled");
    $agency_select.val('');
    $agency_select.data('value', '');
    $agency_select.trigger("chosen:updated");
    $referral_modal.find("#agency_hidden").removeAttr("disabled");

    var $location_select = $referral_modal.find("select#location");
    $location_select.removeAttr("disabled");
    $location_select.removeAttr("chosen-disabled");
    $location_select.val('');
    $location_select.data('value', '');
    $location_select.trigger("chosen:updated");

    var $existing_user_select = $referral_modal.find("#existing_user_referral");
    $referral_modal.find("#existing_user_hidden").removeAttr("disabled");
    $existing_user_select.removeAttr("disabled");
    $existing_user_select.removeAttr("chosen-disabled");
    $existing_user_select.trigger("chosen:updated");

    //Update filters
    this.set_agency_filters();
    this.set_user_filters();
  },

  close_referral: function (e) {
    e.preventDefault();
    var $referral_modal = $('#referral-modal');
    var password = $referral_modal.find('#password').val();
    var local_user = $referral_modal.find("#existing_user_referral").val();
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

  on_user_change: function(e) {
    this.toggle_other_user(e);
    this.populate_filters(e);
  },

  on_service_change: function(e) {
    this.set_agency_filters();
    this.set_user_filters();
    this.clear_agency_selection();
    this.clear_user_selection();
  },

  on_location_change: function(e) {
    this.set_user_filters();
    this.clear_user_selection();
  },

  on_agency_change: function(e) {
    var $agency_select = $(e.target);
    $agency_select.data('value', $agency_select.val());
    this.set_user_filters();
    this.clear_user_selection();
  },

  populate_filters: function(e) {
    var selected_user_name = $(e.target).val();
    if(selected_user_name){
      var selected_user = _primero.populated_user_collection.get_by_user_name(selected_user_name);

      if(selected_user){
        var $referral_modal = $("#referral-modal");
        $referral_modal.find("#agency_hidden").val(selected_user.organization);
        this.populate_agency_filter(selected_user.organization);
        this.populate_location_filter(selected_user.reporting_location_code);
      }
    }
  },

  populate_location_filter: function(location_code, onComplete){
    var self = this;
    var $location_select = $("#referral-modal select#location");
    $location_select.data('value', location_code);
    _primero.populate_reporting_location_select_boxes($location_select, function(){
      $location_select.val(location_code);
      $location_select.trigger('chosen:updated');
      self.set_user_filters();
      if(onComplete){
        onComplete();
      }
    });
  },

  populate_agency_filter: function(agency_id, onComplete){
    var self = this;
    self.set_agency_filters();
    var $agency_select = $("#referral-modal select#agency");
    $agency_select.data('value', agency_id);
    _primero.populate_agency_select_boxes($agency_select, function(){
      $agency_select.val(agency_id);
      $agency_select.trigger('chosen:updated');
      self.set_user_filters();
      if(onComplete){
        onComplete();
      }
    });
  },

  disable_remote_fields: function() {
    $('#other_user').prop('disabled', true);
    $('#other_user_agency').prop('disabled', true);
    $('input[name=other_user_agency][type=hidden]').prop('disabled', true);
  },

  clear_errors: function() {
    var $referral_modal = $('#referral-modal');
    $referral_modal.find(".local_user_flash").hide();
    $referral_modal.find(".remote_user_flash").hide();
    $referral_modal.find(".password_flash").hide();
  },

  select_user_location: function(onComplete){
    var $location_select = $("#referral-modal select#location");
    var current_user_location = $location_select.data('current-user-location');
    this.populate_location_filter(current_user_location, onComplete);
  },

  set_agency_filters: function(){
    var $referral_modal = $("#referral-modal");
    var $service_select = $referral_modal.find('select#service');

    var $agency_select = $referral_modal.find("select#agency");
    $agency_select.data('filter-service-type', $service_select.val());
  },

  set_user_filters: function() {
    var $referral_modal = $("#referral-modal");
    var $service_select = $referral_modal.find('select#service');
    var $location_select = $referral_modal.find("select#location");
    var $agency_select = $referral_modal.find("select#agency");

    var $existing_user_select = $('select#existing_user_referral');
    $existing_user_select.data('filter-service', $service_select.val());
    $existing_user_select.data('filter-agency', $agency_select.val());
    $existing_user_select.data('filter-location', $location_select.val());
  },

  clear_agency_selection: function(){
    var $agency_select = $('select#agency')
    this.clear_select_box($agency_select);
  },

  clear_user_selection: function(){
    var $existing_user_select = $('select#existing_user_referral');
    this.clear_select_box($existing_user_select);
  },

  clear_select_box: function($select_box) {
    $select_box.data('value', '');
    $select_box.val('');
    $select_box.empty();
    $select_box.html('<option value=""></option>');
    $select_box.trigger('change');
    $select_box.trigger('chosen:updated');
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

    $referral_modal.find('.local_toggle').show();

    $referral_modal.find('form').trigger('reset');
  }

});
