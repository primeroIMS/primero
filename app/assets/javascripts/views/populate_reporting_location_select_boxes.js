var ReportingLocationStringSources = _primero.Collections.StringSources.LocationStringSources.extend({
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

    self.collection = new ReportingLocationStringSources();

    self.setupSelectBoxes();

    self.populateSelectBoxes();

    _primero.populate_reporting_location_select_boxes = function($select_box, onComplete){
      if ($select_box) {
        self.setupSelectBox($select_box);
      }
      //Update cached $el
      self.setElement($("form select[data-populate='ReportingLocation']"));
      self.populateSelectBoxes(onComplete);
    }
  },

  setupSelectBoxes: function() {
    var self = this;

    this.$el.on('chosen:ready', function(e) {
      self.initAutoComplete($(e.target));
    })

  },

  setupSelectBox: function($select_box) {
    this.initAutoComplete($select_box);
  },

  populateSelectBoxes: function(onComplete) {
    var self = this;

    if(self.$el.length) {
      self.collection.fetch()
        .done(function() {
          self.parseOptions();
          if(onComplete){
            onComplete();
          }
        })
        .fail(function() {
          self.collection.message = I18n.t('messages.string_sources_failed')
          self.disableAjaxSelectBoxes();
        })
    }
  },

  getSelectedOptions: function(model) {
    var self = this;
    var select_boxes = document.querySelectorAll("[data-populate='" + model.type + "']");
    selected_values = _.compact(_.map(select_boxes, function(field) {
      value = $(field).data('value');
      return value ? value.toString() : value;
    }));

    return _.filter(model.options, function(opt) {
      return _.contains(selected_values, opt.id)
    });
  },



})
