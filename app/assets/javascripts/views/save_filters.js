_primero.Views.SaveFilters = _primero.Views.Base.extend({
  el: '#save_filters',

  events: {
    'click .save_user_filters': 'save_user_filters'
  },

  initialize: function() {
    this.get_user_filters();
  },

  get_user_filters: function() {
    var url = "/cases/get_user_filters";

    $.get(url, function() {
      // TODO: parse and show list
    });
  },


  save_user_filters: function() {
    var self = this;
    var url = "/cases/save_user_filters";
    var payload = {
      name: $(self.el).find('input[name="name"]').val(),
      filter: _primero.filters
    };

    $.post(url, payload, function(message) {
      $(self.el).find('.message').html(message).fadeIn();
    });
  }
});
