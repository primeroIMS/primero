_primero.Views.Base = Backbone.View.extend({
  constructor: function() {
    var self = this;

    dispatcher.on('CloseView', this.close, this );

    Backbone.View.apply(this, arguments);
  },

  close: function() {
    dispatcher.off( 'CloseView', this.close, this );
    dispatcher.off('CleanTables', this.destroy_all_tables, this);
    this.undelegateEvents();
    this.remove();
  },

  apply_filters: function(evt) {
    evt.preventDefault();

    var prev_params = _primero.clean_page_params(['scope', 'page']);
    var url_string = _primero.object_to_params(_primero.filters);
    var add_amp = '&';
    var search;

    if (prev_params && url_string === '' || !prev_params || !prev_params && url_string === '') {
      add_amp = '';
    }

    search = prev_params + add_amp + url_string;
    Turbolinks.visit(window.location.pathname + '?' + search);
  },

  map_filter_object: function(filters) {
    var new_filters = {};
    _.each(filters, function(filter) {
      if (Array.isArray(filter.value)) {
        new_filters[filter.name] = filter.value;
      } else {
        _.each(filter.value, function(sub_filter, sub_key) {
          var key = filter.name + '[' + sub_key + ']';
          new_filters[key] = sub_filter;
        });
      }
    });

    return new_filters;
  },

  get_filter: function(e) {
    e.preventDefault();

    var filter_id = $(e.target).attr('data-id');
    var self = this;

    $.get('/saved_searches/' + filter_id, function(data) {
      var filters = self.map_filter_object(data.filters);
      _primero.filters = filters;
      self.apply_filters(e);
    });
  }
});
