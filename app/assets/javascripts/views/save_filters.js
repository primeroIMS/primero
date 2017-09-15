_primero.Views.SaveFilters = _primero.Views.Base.extend({
  el: '#save_filters',

  events: {
    'click .save_user_filters': 'save_user_filters',
    'click .user_filter': 'get_filter',
    'keyup input[name="name"]': 'disable_enable_submit'
  },

  disable_enable_submit: function(e) {
    var btn = $(this.el).find('button');

    if ($(e.target).val()) {
      btn.removeAttr('disabled')
    } else {
      btn.attr('disabled', 'disabled')
    }
  },

  save_user_filters: function() {
    var self = this;
    var url = "/saved_searches";
    var name = $(self.el).find('input[name="name"]').val();
    var record_type = window._primero.model_object;
    var payload = {
      name: name,
      filter: _primero.filters,
      record_type: record_type
    };

    if (name){
      $.post(url, payload, function(response) {
        $(self.el).find('.message').html(response.message).fadeIn();
      });
    } else {
      $(this.el).find('.message').show();
    }
  }
});
