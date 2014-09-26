var ShowChangeLog = Backbone.View.extend({
  el: 'body',
  events: {
    'click span#show_change_log' : 'show_change_log'
  },

  show_change_log: function(event) {
    event.preventDefault();
    var show_history_button = $(event.target);
    var history_url = show_history_button.data('change_log_url');
    var target_div = $("#" + show_history_button.data('reveal-id'));
    if (target_div.html() == "") {
      $.get( history_url, function(response) {
        target_div.html(response);
      });
    }
  }
});

$(document).ready(function() {
  new ShowChangeLog();
});