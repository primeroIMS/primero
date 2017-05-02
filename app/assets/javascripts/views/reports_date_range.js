var ReportsDateRange = Backbone.Model.extend({
  defaults: {
    filter_type: 'none',
    filter_type_display: '',
    filters: [],
  },

  pushFilter: function(type, filter, value, display_text) {
    var filters = this.get('filters');

    filters.push({
      type: type,
      filter: filter,
      value: value,
      display_text: display_text
    });

    this.set('filters', filters);
  },

  removeFilter: function(filter) {
    var filters = this.get('filters');

    filters = _.without(filters, _.findWhere(filters, {
      filter: filter
    }));

    this.set('filters', filters);
  }
})

ControlChildView = Backbone.View.extend({
  template: JST['templates/reports_date_range_controls'],

  el: '#report_filter_controls',

  initialize: function() {
    _.bindAll(this, "render");
    this.model.bind('change', this.render);
  },

  render: function() {
    $(this.el).find('.controls').html(this.template({
      m: this.model.toJSON()
    }));
  }
});

FilterDisplayChildView = Backbone.View.extend({
  template: JST['templates/reports_filters_selected'],

  el: '#report_filter_controls',

  initialize: function() {
  },

  render: function() {
    $(this.el).find('.filters-selected').html(this.template({
      m: this.model.toJSON()
    }));
  }
});

_primero.Views.ReportsDateRange = Backbone.View.extend({
  template: JST['templates/reports_date_range_control'],

  el: '#report_filter_controls',

  model: new ReportsDateRange,

  events: {
    'change select[name="filter-control"]': 'filter_type_event',
    'click .close, .open': 'toggle_filter_panel'
  },

  initialize: function() {
    this.render();
    this.set_filter_type();
    console.log(this.parseParams(window.location.search.split('?')[1] || ''));
  },

  // TODO: This should be moved to a parent view for overall filters
  toggle_filter_panel: function(e) {
    var action = e.target.dataset.action == 'close' ? 'slideUp' : 'slideDown';
    var openButton = $('.open');
    console.log('here', action)

    if (action !== 'slideUp') {
      openButton.addClass('currently');
    } 

    $(this.el).find('.panel')[action]({
      complete: function() {
        if (action === 'slideUp') {
          openButton.removeClass('currently');
        }
      }
    });
  },

  filter_type_event: function(e) {
    e.preventDefault();
    var value = e.target.value
    this.set_filter_type(value)
  },

  // TODO: Temp hardcoding select values. Also I18n?
  set_filter_type: function(value = null) {
    var filter_type_control = $('select[name="filter-control"]');
    var selected_option_text = $('select[name="filter-control"] option:selected').text();

    value = value || filter_type_control.val();
    
    var filter = function() {
      var which_filter = 'none';
      if (_.contains(['week', 'day'], value)) {
        which_filter = 'range'
      } else if (_.contains(['month', 'year'], value)) {
        which_filter = 'by'
      } 

      return which_filter
    }

    this.model.set('filter_type_display', selected_option_text);
    this.model.set('filter_type', filter());
  },

  parseParams: function(query) {
    var params = {};
    var e;
    var re = /([^&=]+)=?([^&]*)/g;
    var decodeRE = /\+/g;
    var decode = function (str) {
      return decodeURIComponent(str.replace(decodeRE, " "));
    };

    while ( e = re.exec(query) ) { 
        var k = decode( e[1] ), v = decode( e[2] );
        if (k.substring(k.length - 2) === '[]') {
            k = k.substring(0, k.length - 2);
            (params[k] || (params[k] = [])).push(v);
        }
        else params[k] = v;
    }
    return params;
  },

  render: function() {
    $(this.el).html(this.template);
    new ControlChildView({model: this.model});
    
    if (window.location.search) {
      var filter_display = new FilterDisplayChildView({model: this.model});
      filter_display.render();
    }

    return this;
  }
});