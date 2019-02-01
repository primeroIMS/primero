_primero.Collections.StringSources.LocationStringSources = _primero.Collections.StringSources.extend({
  initialize: function() {
    this.url = '/options/' + _.find(_primero.options_loc, function(path) {
      return path.match('options_' + I18n.locale);
    })
  },

  selected_values: null,

  parse: function(resp) {
    this.status = true;

    return resp;
  },

  findLocations: function (term) {
    var regex = new RegExp(term, 'i');
    var model = _.first(this.models).attributes

    return _.filter(model.options, function(opt) {
      return regex.test(opt.display_text)
    })
  }
})

_primero.Views.PopulateLocationSelectBoxes = _primero.Views.PopulateSelectBoxes.extend({
  el: "form select[data-populate='Location']",

  initialize: function() {
    this.option_string_sources = ['Location']

    this.collection = new _primero.Collections.StringSources.LocationStringSources();

    this.populateSelectBoxes();
  },

  populateSelectBoxes: function() {
    var self = this;

    this.$el.on('chosen:ready', function(e) {
      self.initAutoComplete($(e.target))
    })

    _primero.populate_location_select_boxes = function(onComplete) {
      if (self.$el.length) {
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
    }
    _primero.populate_location_select_boxes();
  },

  initAutoComplete: function($select_boxes) {
    var self = this;

    $select_boxes.parent().find('.chosen-search input').autocomplete({
      delay: 900,
      source: function(request, response) {
        var element = this.element.parents('.chosen-container').prev('select');
        var options = _.compact(_.union(_.first(self.collection.findLocations(request.term), 50), self.collection.selected_values));

        response(self.addOptions(options, element))

        this.element.val(request.term);
      }
    })
  },

  getSelectedOptions: function(model) {
    var self = this;

    selected_values = _.compact(_.map(self.$el, function(field) {
      value = $(field).data('value');
      return value ? value.toString() : value;
    }))

    return _.filter(model.options, function(opt) {
      return _.contains(selected_values, opt.id)
    })
  },

  getModelOptions: function(model) {
    this.collection.selected_values = this.getSelectedOptions(model)
    return _.compact(_.union(_.first(model.options, 20), this.collection.selected_values));
  }
})
