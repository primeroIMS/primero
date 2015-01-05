var ReferRecords = Backbone.View.extend({

  el: 'body',

  events: {
    'click a.referral_index_action' : 'refer_records'
  },

  refer_records: function() {
    var selected_records = _primero.indexTable.get_selected_records();
    $("#selected_referral_records").val(selected_records);
  }
});

$(document).ready(function() {
  new ReferRecords();
});
