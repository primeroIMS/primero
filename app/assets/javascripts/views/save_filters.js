_primero.Views.SaveFilters = _primero.Views.Base.extend({
  el: '#save_filters',

  events: {
    'click .save_user_filters': 'save_user_filters'
  },

  save_user_filters: function() {
    var self = this;
    var url = "/cases/save_user_filters";
    var name = $(self.el).find('input[name="name"]').val();
    var payload = {
      name: name,
      filter: _primero.filters
    };

    if (name){
      $.post(url, payload, function(message) {
        $(self.el).find('.message').html(message).fadeIn();
      });
    } else {
      $(this.el).find('.message').show();
    }
  }
});
