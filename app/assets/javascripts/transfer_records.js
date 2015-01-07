var TransferRecords = Backbone.View.extend({

  el: 'body',

  events: {
    'click a.transfer_index_action' : 'transfer_records',
    'change div#transfer-modal input[name="is_remote"]' : 'toggle_remote_primero'
  },

  transfer_records: function() {
    var selected_records = _primero.indexTable.get_selected_records();
    $("#transfer-modal #selected_records").val(selected_records);
  },

  toggle_remote_primero: function() {
    $('#transfer-modal label.remote_toggle').toggle();
  }
});

$(document).ready(function() {
  new TransferRecords();
});
