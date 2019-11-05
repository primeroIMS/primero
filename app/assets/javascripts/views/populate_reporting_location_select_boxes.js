_primero.Collections.ReportingLocationStringSources = _primero.Collections.StringSources.LocationStringSources.extend({
  findLocations: function (term) {
    var regex = new RegExp(term, 'i');
    var model = _.first(_.filter(this.models, function(model){ return model.get('type') == 'ReportingLocation' })).attributes

    return _.filter(model.options, function(opt) {
      return regex.test(opt.display_text)
    })
  }
});

_primero.Views.PopulateReportingLocationSelectBoxes = _primero.Views.PopulateLocationSelectBoxes.extend({
  el: "form select[data-populate='ReportingLocation']",
  initialize: function() {
    var self = this;

    self.option_string_sources = ['ReportingLocation']

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
