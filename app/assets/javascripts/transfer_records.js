var TransferRecords = Backbone.View.extend({

  el: 'body',

  events: {
    'click a.transfer_index_action' : 'transfer_records',
    'change div#transfer-modal input[name="is_remote"]' : 'toggle_remote_primero',
    'change div#transfer-modal select#existing_user' : 'toggle_other_user',
    'change div#transfer-modal input#other_user' : 'toggle_existing_user',
    'click div#transfer-modal input[type="submit"]' : 'close_transfer'
  },

  transfer_records: function() {
    var selected_records = _primero.indexTable.get_selected_records();
    $("#transfer-modal #selected_records").val(selected_records);
  },

  toggle_remote_primero: function() {
    $('#transfer-modal div.remote_toggle').toggle();
  },

  toggle_other_user: function(e) {
    var existing_user = $(e.target).val(),
        other_user_input = $('#transfer-modal input#other_user'),
        other_user_agency_input = $('#transfer-modal input#other_user_agency');
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
        existing_user_select = $('#transfer-modal select#existing_user');

     if(other_user == null || other_user == undefined || other_user.trim() == ""){
      existing_user_select.prop('disabled', false);
     } else {
      existing_user_select.prop('disabled', true);
     }
  },

  close_transfer: function(e) {
    e.preventDefault();
    $(e.target).parents('form').submit();
    $('#transfer-modal').foundation('reveal', 'close');
    $('#transfer-modal form')[0].reset();
    $('#transfer-modal div.remote_toggle').hide();
    window.disable_loading_indicator = true;
  }
});

$(document).ready(function() {
  new TransferRecords();
});
