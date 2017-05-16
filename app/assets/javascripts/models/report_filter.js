_primero.Models.ReportFilter = Backbone.Model.extend({
  defaults: {
    filters: [{
      name: 'date',
      display: null,
      type: '',
      value: null,
      options: {
        months: I18n.t('date.month_names')
      }
    }],
    params: {}
  },

  build_query: function() {
    var filters = [];

    _.each(this.get('filters'), function(v) {
      var param = v.name + '=' + [v.type, v.value.join('.')].join('.')
      filters.push(param)
    });

    if (filters.length > 1) {
      return filters.join('&');
    } else {
      return filters[0]
    }
  },

  updateFilter: function(name, type, value, display) {
    var filters = this.get('filters');

    _.extend(_.findWhere(filters, {name: name}), {
      type: type,
      value: value,
      display: display
    });

    this.set('filters', filters);
    this.trigger('change', this, {});
  },

  clearFilter: function(name) {
    var filters = this.get('filters');

    _.extend(_.findWhere(filters, {name: name}), {
      type: null,
      value: null,
      display: null
    });

    this.set('filters', filters);
    this.trigger('change', this, {});
  }
});
