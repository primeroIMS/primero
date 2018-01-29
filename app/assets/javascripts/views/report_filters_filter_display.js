_primero.Views.ReportsFiltersDisplay = Backbone.View.extend({
  template: JST['templates/reports_filters_selected'],

  el: '#report_filter_controls',

  initialize: function() {
    _.bindAll(this, "render");
    this.model.bind('change', this.render);
  },

  render: function() {
    $(this.el).find('.filters-selected').html(this.template({
      m: this.model.toJSON()
    }));
  }
});