var ReferRecords = Backbone.View.extend({

  el: 'body',

  events: {
    'click a.referral_index_action' : 'refer_records',
    'change div#referral-modal input[name="is_remote"]' : 'toggle_remote_primero',
    'click div#referral-modal input[type="submit"]' : 'close_referral'
  },

  refer_records: function() {
    var selected_records = _primero.indexTable.get_selected_records();
    $("#referral-modal #selected_records").val(selected_records);
  },

  toggle_remote_primero: function() {
    $('#referral-modal div.remote_toggle').toggle();
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
