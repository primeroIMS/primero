var StringSources = Backbone.Collection.extend({
  url: '/string_sources'
});

_primero.Views.PopulateSelectBoxes = Backbone.View.extend({
  el: 'form select',

  initialize: function() {
    var self = this;

    // TODO: Use this when adding all other options_string_sources. Currently hardcoding Locations.
    // this.option_string_sources = _.uniq(_.map(, function(element) { 
    //   return $(element).attr('data-populate')
    // }));
    this.option_string_sources = ['Location']
    this.collection = new StringSources();
    this.collection.fetch({
      data: $.param({
        string_sources: this.option_string_sources
      })
    }).done(function() {
      self.parseOptions();
    });
  },

  parseOptions: function() {
    var self = this;

    this.collection.each(function(string_source) {
      var model = string_source.attributes;
      var select_boxes = document.querySelectorAll("[data-populate='" + model.type + "']");
      var $select_boxes = $(select_boxes);

      var options = _.map(model.options, function(option) {
        return '<option value="' + option + '">' + option + '</option>'
      });

      // Ensure select box is empty
      $select_boxes.empty();
      $select_boxes.html(options.join(''));
      self.updateSelectBoxes($select_boxes);
    });
  },

  updateSelectBoxes: function(select_boxes) {
    _.each(select_boxes, function(select) {
      var value = select.getAttribute('data-value');
      var placeholder;

      // Add back placeholder
      placeholder = select.getAttribute('data-placeholder');
      $(select).prepend('<option value="" default selected>' + placeholder + '</option>');
      
      if (value) {
        select.value = value;
      }
    });

    select_boxes.trigger('chosen:updated');
  }
});