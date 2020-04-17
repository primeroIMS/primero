_primero.Collections.ReportingLocationStringSources = _primero.Collections.StringSources.LocationStringSources.extend({
  findLocations: function (term) {
    var regex = new RegExp(term, 'i');
    var admin_level = _primero.reporting_location_admin_level;
    var model = _.first(_.filter(this.models, function(model){ return model.get('type') == 'ReportingLocation' + admin_level })).attributes;

    return _.filter(model.options, function(opt) {
      return regex.test(opt.display_text)
    })
  }
});

_primero.Views.PopulateReportingLocationSelectBoxes = _primero.Views.PopulateLocationSelectBoxes.extend({
  el: "form select[data-populate='ReportingLocation']",
  initialize: function() {
    var self = this;
    var admin_level = _primero.reporting_location_admin_level;

    self.option_string_sources = ['ReportingLocation' + admin_level];

    self.collection = new _primero.Collections.ReportingLocationStringSources();

    self.setupSelectBox();

    _primero.populate_reporting_location_select_boxes = function($select_box, onComplete){
      self.populateSelectBoxes($select_box, onComplete);
    }

    self.$el.each(function(index, elem){
      self.populateSelectBoxes($(elem));
    });
  },
});
