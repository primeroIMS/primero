_primero.Views.ReportFiltersDateRangeControl = Backbone.View.extend({
  template: JST['templates/reports_date_range_controls'],

  el: '#report_filter_controls',

  events: {
    'change input[name="date_from_control"]': 'populateTo'
  },

  initialize: function() {
    _.bindAll(this, "render");
    this.model.bind('change', this.render);
  },

  populateTo: function(e) {
    var from_field = $(e.target);
    var to_field = $('input[name="date_to_control"]')

    if (!to_field.val() && from_field.val()) {
      to_field.val(from_field.val());
    }
  },

  setControlValue: function() {
    var filterType = this.model.get('filter_type');

    if (filterType) {
      $("#filter-control option[value='" + filterType + "']").attr("selected", "selected");
    }
  },

  render: function() {
    var filter = _.findWhere(this.model.get('filters'), {name: 'date'});

    $(this.el).find('.controls').html(this.template({ m: filter }));

    this.setControlValue();
  }
});