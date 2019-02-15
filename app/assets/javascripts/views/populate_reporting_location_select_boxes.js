var ReportingLocationStringSources = _primero.Collections.StringSources.LocationStringSources.extend({
  findLocations: function (term) {
    var regex = new RegExp(term, 'i');
    var model = _.first(_.filter(this.models, function(model){ return model.get('type') == 'ReportingLocation' })).attributes

    return _.filter(model.options, function(opt) {
      return regex.test(opt.display_text)
    })
  }
})

_primero.Views.PopulateReportingLocationSelectBoxes = _primero.Views.PopulateLocationSelectBoxes.extend({
  el: "form select[data-populate='ReportingLocation']",
  initialize: function() {
    
    this.option_string_sources = ['ReportingLocation']

    this.collection = new ReportingLocationStringSources();

    this.populateSelectBoxes();
  }
})
