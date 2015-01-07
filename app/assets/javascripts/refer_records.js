var ReferRecords = Backbone.View.extend({

  el: 'body',

  events: {
    'click a.referral_index_action' : 'refer_records',
    'change div#referral-modal input[name="is_remote"]' : 'toggle_remote_primero'
  },

  refer_records: function() {
    var selected_records = _primero.indexTable.get_selected_records();
    $("#referral-modal #selected_records").val(selected_records);
  },

  toggle_remote_primero: function() {
    $('#referral-modal label.remote_toggle').toggle();
  }
});

$(document).ready(function() {
  new ReferRecords();
});
