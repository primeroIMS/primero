_primero.Collections.AgencyCollection = Backbone.Collection.extend({
  url: '/api/agencies',

  selected_values: null,

  parse: function(resp) {
    this.status = resp.success;
    this.message = resp.message;
    return resp.agencies;
  },

  find_by_name: function(agency_name){
    var regex = new RegExp(agency_name, 'i');
    var self = this;
    var agencies = self.filter(function(agency){
      return regex.test(agency.get('name'));
    })
    return _.map(agencies, function(agency){ return agency.attributes; });
  }
});

_primero.Views.PopulateAgencySelectBoxes = _primero.Views.PopulateUserSelectBoxes.extend({
  el: "form select[data-populate='Agency use_api']",

  initialize: function(){
    var self = this;

    self.option_string_sources = ['Agency use_api'];

    self.collection = new _primero.Collections.AgencyCollection();

    self.collection.fetch().done(function(){
      self.initialOptions();
    })

    self.setupSelectBox();

    _primero.populate_agency_select_boxes = function($select_box, onComplete) {
      self.populateSelectBoxes($select_box, onComplete);
    }
  },

  getOptionsFromValue: function(value) {
    var seletectedAgency = this.collection.get(value);
    var values = [];
    if(seletectedAgency) {
      values.push(seletectedAgency.attributes)
    } else if(value) {
      var displayText = I18n.t("messages.non_active_agency", { agency: value });
      values.push({id: value, agency_code: value, name: displayText});
    }
    return this.convertToOptions(values);
  },

  findByTerm: function(term) {
    return this.collection.find_by_name(term);
  },

  getRequiredFilters: function() {
    return {};
  },

  getMoreFilters: function($select_box) {
    return {
      service_type: $select_box.data("filter-service-type")
    }
  },

  updateCollectionCache: function() {
    _primero.populated_agency_collection = this.collection;
  },

  convertToOptions: function(models){
    return _.map(models, function(model){
      return { id: model.id, display_text: model.name };
    });
  }

});
