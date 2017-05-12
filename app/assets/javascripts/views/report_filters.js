_primero.Views.ReportFilters = Backbone.View.extend({
  template: JST['templates/reports_date_range_control'],

  el: '#report_filter_controls',

  model: new _primero.Models.ReportFilter(),

  events: {
    'change select[name="filter-control"]': 'filter_type_event',
    'click .close, .open': 'toggle_filter_panel'
  },

  initialize: function() {
    this.render();
    this.set_filter_type();
    this.set_params();
  },

  set_params: function() {
    var params = this.parse_params(window.location.search.split('?')[1] || '')

    if (params) {
      this.model.set('params', params);
    }

    this.set_filters();
  },

  set_filters: function() {
    var self = this;
    var params = this.model.get('params');

    if (params) {
      _.each(params, function(v, k) {
        var filter = v.split('.');
        self.model.updateFilter(k, filter.shift(), filter);
      });
    }
  },

  toggle_filter_panel: function(e) {
    var action = e.target.dataset.action === 'close' ? 'slideUp' : 'slideDown';
    var openButton = $('.open');

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
    var value = e.target.value;
    var text = $(e.target).find('option:selected').text();
    this.model.updateFilter('date', value, null, text);
    console.log(this.model.attributes)
  },

  // TODO: Temp hardcoding select values. Also I18n?
  set_filter_type: function(value = null) {
    var filter_type_control = $('select[name="filter-control"]');
    var selected_option_text = $('select[name="filter-control"] option:selected').text();

    this.model.set('filter_type_display', selected_option_text);
    this.model.set('filter_type', filter_type_control.val());
    console.log(this.model)
  },

  parse_params: function(query) {
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
    new _primero.Views.ReportFiltersDateRangeControl({model: this.model});

    if (window.location.search) {
      var filter_display = new _primero.Views.ReportsFiltersDisplay({model: this.model});
      filter_display.render();
    }

    return this;
  }
});