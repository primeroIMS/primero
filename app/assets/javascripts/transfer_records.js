var TransferRecords = Backbone.View.extend({

  el: 'body',

  events: {
    'click a.transfer_index_action' : 'transfer_records'
  },

  transfer_records: function() {
    var selected_records = _primero.indexTable.get_selected_records();
    $("#transfer-modal #selected_records").val(selected_records);
  }
});

$(document).ready(function() {
  new TransferRecords();
});
