_primero.Views.ReportFilters = Backbone.View.extend({
  template: JST['templates/reports_date_range_control'],

  el: '#report_filter_controls',

  model: new _primero.Models.ReportFilter(),

  events: {
    'change select[name="filter-control"]': 'filter_type_event',
    'click .close, .open': 'toggle_filter_panel',
    'click .clear_filters': 'clear_filters',
    'click .submit_filters': 'filter'
  },

  initialize: function() {
    this.render();
    this.set_params();
  },

  filter: function(e) {
    var control = $(e.target);
    var form = control.parents('form');
    var data = form.serializeArray();
    var filter_values = [];

    var filter_control = form.find('select#filter-control');
    var filter = filter_control.val();
    var filter_display = filter_control.find('option:selected').text()

    _.each(data, function(k) {
      if (k.name != 'filter-control') {
        filter_values.push(k.value);
      }
    });

    this.model.updateFilter('date', filter, filter_values, filter_display);

    window.location.search = this.model.build_query();
  },

  set_params: function() {
    var params = this.parse_params(window.location.search.split('?')[1] || '');

    if (params) {
      this.model.set('params', params);
    }

    this.set_filters();
  },

  set_filters: function() {
    var self = this;
    var params = this.model.get('params');

    if (params) {
      _.each(params.scope, function(v, k) {
        var filter = v.split('||');
        var type = filter[0];
        var values = filter[1].split('.');

        // TODO: This will have to change when we add more filters.
        var filter_control = $('.filter-control-' + k);
        var display = filter_control.find('option[value="' + type + '"]');

        display.attr('selected','selected');

        self.model.updateFilter(k, type, values, display.text());

        var inputs = filter_control.parents('form').find('.controls input, .controls select');

        if (_.isArray(values)) {
          for (var i = 0; i < inputs.length; i++) {
            inputs[i].value = values[i];
          }
        }
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
    var control = $(e.target);
    var value = control.val();
    var text = control.find('option:selected').text();

    this.model.updateFilter('date', value, null, text);
  },

  parse_params: function(query) {
    var params = {};
    var e;
    var re = /([^&=]+)=?([^&]*)/g;
    var decodeRE = /\+/g;
    var decode = function (str) {
      return decodeURIComponent(str.replace(decodeRE, " "));
    };

    while (e = re.exec(query)) {
      var k = decode(e[1]), v = decode(e[2]);
      var b = k.match(/^(\w*)\b\[(\w+)\]/);

      if (k.substring(k.length - 2) === '[]') {
        k = k.substring(0, k.length - 2);
        (params[k] || (params[k] = [])).push(v);
      } else if (b) {
        if (!params[b[1]]) {
          params[b[1]] = {};
        }
        params[b[1]][b[2]] = v
      } else {
        params[k] = v;
      }
    }

    return params;
  },

  clear_filters: function() {
    window.location = window.location.origin + window.location.pathname;
    return false;
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