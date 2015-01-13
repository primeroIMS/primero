var ReferRecords = Backbone.View.extend({

  el: 'body',

  events: {
    'click a.referral_index_action' : 'refer_records',
    'change div#referral-modal input[name="is_remote"]' : 'toggle_remote_primero',
    'change div#referral-modal select#existing_user' : 'toggle_other_user',
    'change div#referral-modal input#other_user' : 'toggle_existing_user',
    'click div#referral-modal input[type="submit"]' : 'close_referral'
  },

  refer_records: function() {
    var selected_records = _primero.indexTable.get_selected_records();
    $("#referral-modal #selected_records").val(selected_records);
  },

  toggle_remote_primero: function() {
    $('#referral-modal div.remote_toggle').toggle();
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
    $(e.target).parents('form').submit();
    $('#referral-modal').foundation('reveal', 'close');
    $('#referral-modal form')[0].reset();
    $('#referral-modal div.remote_toggle').hide();
    window.disable_loading_indicator = true;
  }
});

$(document).ready(function() {
  new ReferRecords();
});
