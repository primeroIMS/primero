var StringSources = Backbone.Collection.extend({
  url: '/api/options',

  parse: function(resp) {
    this.status = resp.success;
    this.message = resp.message;
    this.placeholder = resp.placeholder;

    return resp.sources;
  }
});

_primero.Views.PopulateSelectBoxes = _primero.Views.Base.extend({
  el: 'form select',

  initialize: function() {
    var self = this;
    _primero.populate_select_boxes = function() {
      self.option_string_sources = self.getStringSourcesOptions()

      if (self.option_string_sources.length > 0) {
        self.collection = new StringSources();
        self.collection.fetch({
          data: $.param({
            string_sources: self.option_string_sources,
            locale: I18n.defaultLocale
          })
        }).done(function() {
          self.parseOptions();
        }).fail(function() {
          self.disableAjaxSelectBoxes();
        });
      }
    };

    _primero.populate_select_boxes();
  },

  getStringSourcesOptions: function() {
    var selects = $('form select');
    var lookup_options = _.uniq(_.map(selects, function(element) {
      return $(element).attr('data-populate')
    }));

    return _.without(lookup_options, 'null', 'User', undefined);
  },

  disableAjaxSelectBoxes: function() {
    var self = this;
    var message = this.collection.message

    _.each(this.option_string_sources, function(source) {
      var select_boxes = document.querySelectorAll("[data-populate='" + source + "']");
      var $select_boxes = $(select_boxes);

      $select_boxes.attr('disabled', true);
      self.updateDisabledSelectBoxes($select_boxes);
    });

    if (message) {
      $('.side-tab-content')
        .prepend('<div data-alert class="callout warning">' + message + '</div>');
    }
  },

  parseOptions: function() {
    var self = this;

    if (this.collection.status) {
      this.collection.each(function(string_source) {
        var model = string_source.attributes;
        var select_boxes = document.querySelectorAll("[data-populate='" + model.type + "']");
        var $select_boxes = $(select_boxes);

        var options = _.map(model.options, function(option) {
          return '<option value="' + option.id + '">' + option.display_text + '</option>'
        });

        // Ensure select box is empty
        $select_boxes.empty();
        $select_boxes.html(options.join(''));
        self.updateSelectBoxes($select_boxes);
      });
    } else {
      this.disableAjaxSelectBoxes();
    }
  },

  updateSelectBoxes: function(select_boxes) {
    var self = this;

    _.each(select_boxes, function(select) {
      var this_select = $(select);
      var value = this_select.data('value');
      var placeholder;

      /*
      * Add back placeholder
      * There is currently a bug in chose that won't add back the placeholder when update is triggered.
      * We will need to update chosen when this is fixed.
      * https://github.com/harvesthq/chosen/issues/2638
      */
      placeholder = select.getAttribute('data-placeholder') || self.collection.placeholder;

      this_select.prepend('<option value="" default selected>' + placeholder + '</option>');

      if (value) {
        this_select.val(value);
      }
    });

    select_boxes.trigger('chosen:updated');
  },

  updateDisabledSelectBoxes: function(select_boxes) {
    _.each(select_boxes, function(select) {
      var value = select.getAttribute('data-value');

      if (value) {
        $(select).append('<option value="'+ value +'" selected>' + value + '</option>');
      }
    });

    select_boxes.trigger('chosen:updated');
  }
});