_primero.Collections.StringSources = Backbone.Collection.extend({
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
        self.collection = new _primero.Collections.StringSources();
        self.collection.fetch({
          data: $.param({
            string_sources: self.option_string_sources,
            locale: I18n.locale
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

    return _.without(lookup_options, 'null', 'User', undefined, 'Location', 'ReportingLocation', 'Agency use_api');
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

  getModelOptions: function(model) {
    return model.options
  },

  parseOptions: function() {
    var self = this;

    if (this.collection.status) {
      this.collection.each(function(string_source) {
        var model = string_source.attributes;
        var select_boxes = document.querySelectorAll("[data-populate='" + model.type + "']");
        var $select_boxes = $(select_boxes);

        self.addOptions(self.getModelOptions(model), $select_boxes);
      });
    } else {
      this.disableAjaxSelectBoxes();
    }
  },

  addOptions: function(options, element, append) {
    var options = _.map(options, function(option) {
      return '<option value="' + option.id + '">' + option.display_text + '</option>'
    });

    // Ensure select box is empty
    element.empty();
    element.html(options.join(''));
    this.updateSelectBoxes(element);
  },

  updateSelectBoxes: function(select_boxes) {
    var self = this;

    _.each(select_boxes, function(select) {
      var this_select = $(select);
      var value = this_select.data('value');
      var placeholder;

      if (!select.multiple) {
        /*
         * Add back placeholder - BUT only for Single Selects
         * There is currently a bug in chose that won't add back the placeholder when update is triggered.
         * We will need to update chosen when this is fixed.
         * https://github.com/harvesthq/chosen/issues/2638
         */
        placeholder = select.getAttribute('data-placeholder') || self.collection.placeholder;
        this_select.prepend('<option value="" default selected>' + placeholder + '</option>');
      }

      if (value) {

        if(value !== "") {
          var values = _.isArray(value) ? value : value.toString().split(",");
          _.each(values, function(currentValue) {
            self.addNonActiveOption(this_select, currentValue);
          });
        }

        this_select.val(value);
      }
    });

    select_boxes.trigger('chosen:updated');
  },

  addNonActiveOption: function(select_box, value){
    var stringsSource = select_box.attr('data-populate');
    var isAgency = stringsSource.indexOf('Agency') != -1;
    var isService = stringsSource.indexOf('lookup-service-type') != -1;

    if(isAgency || isService) {
      // If the selected value does not exists we will render it hidden to avoid losing it on save.
      var valueNotExists = select_box.find('option[value=' + value + ']').length < 1;

      if(valueNotExists) {
        var displayText = value;
        if(isService) {
          displayText = I18n.t("messages.non_active_service", { service: value });
        } else if(isAgency) {
          displayText = I18n.t("messages.non_active_agency", { agency: value });
        }
        select_box.append('<option style="display: none" value="' + value + '">' + displayText + '</option>');
      }
    }
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
