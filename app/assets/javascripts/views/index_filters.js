_primero.Views.IndexFilters = Backbone.View.extend({

  pagination: typeof pagination_details === 'undefined' ? false : pagination_details,

  el: '.page_content',

  form: 'form#index_filter_form',

  events: {
    'click .filter-controls input[type="checkbox"]': 'change_scope',
    'change .filter-controls input[type="text"]': 'change_scope',
    'change select[filter_type="location"]': 'change_scope',
    'click #apply_filter': 'apply_filters',
    'click .clear_filters': 'clear_filters',
    'change #violations_selector': 'on_violations_toggle'
  },

  initialize: function() {
    this.set_current_scope();
    this.check_selected_violations();
    _primero.chosen('select.chosen-select:visible');
  },

  on_violations_toggle: function(e) {
    this.toggle_violations($(e.target).val())
  },

  toggle_violations: function(value) {
    $('.violation-fields > div').addClass('hide');

    if (value) {
      _.each(value, function(v) {
        $('.violation-fields div[data-type-id="' + v + '"]').removeClass('hide');
      })
    }
  },

  check_selected_violations: function() {
    var $violation_fields = $('.violation-fields');
    var $violations_selector = $('#violations_selector');
    var $selector_values = [];

    _.each(_primero.filters, function(v, k) {
      var violation_field = $violation_fields.find('input[name="' + k + '"]');
      
      if (!_.isEmpty(violation_field.val())) {
        $selector_values.push($(violation_field).parents('.violation').attr('data-type-id'));
      }
    });

    this.toggle_violations($selector_values);
    $violations_selector.val($selector_values);
    $violations_selector.trigger('update');
  },

  clear_filters: function(e) {
    var default_filter, filter = {}, url_string;

    if (_primero.model_object === 'child') {
      default_filter = 'child_status'
    } else if (_primero.model_object === 'tracing_request') {
      default_filter = 'inquiry_status'
    } else {
      default_filter = 'status'
    }

    filter[default_filter] = 'list||Open';
    filter['record_state'] = 'list||true';
    url_string = _primero.object_to_params(filter);
    window.location.search = url_string;
  },

  set_current_scope: function() {
    var self = this;

    $(this.form).find('input, select').each(function() {
      var name = $(this).attr('name'),
          current_scope = _primero.get_param('scope[' + name + ']'),
          current_scope = current_scope ? current_scope.split('||') : false,
          type = $(this).attr('filter_type') || 'single';

      if(_primero.getInternetExplorerVersion() != -1 &&  current_scope) {
        $(current_scope).each(function(i, ce){
          current_scope[i] = encodeURI(ce);
        });
      }

      if ($(this).is(':checkbox') && $(this).is(':checked')) {
        self.set_array_filter(name, $(this).val(), type);
      }

      if ($(this).is(':checkbox') && _.contains(current_scope, encodeURI($(this).val()))) {
        $(this).attr('checked', true);
        self.set_array_filter(name, $(this).val(), type);
      }

      if (type === 'date_range') {
        fields = $(this).parents('.filter-controls').find('input');
        current_scope = _.without(current_scope, type);
        if (current_scope.length > 0) {
          date_values = current_scope[0].split('.');
          if (fields.length == 2) {
            // Preserve selected dates in datepickers 'from' and 'to'
            $(fields[0]).val(date_values[0]);
            $(fields[1]).val(date_values[1]);
          }
          self.set_date_range(date_values, name, type);
        }
      }
      else if (type === 'location') {
        if (current_scope !== false) {
          self.set_remove_filter(name, current_scope);
        }
      }
    });
  },

  apply_filters: function(evt) {
    evt.preventDefault();

    var prev_params = _primero.clean_page_params(['scope', 'page']),
        url_string = _primero.object_to_params(_primero.filters),
        add_amp = '&';

    if (prev_params && url_string === '' || !prev_params || !prev_params && url_string === '') {
      add_amp = '';
    }
    window.location.search = prev_params + add_amp + url_string;
  },

  set_date_range: function(date_values, filter, filter_type) {
    var date_from = date_values[0],
      date_to = date_values[1],
      date_separator = date_from && date_to ? '.': '';

    if (!date_to && !date_from) {
      date_range = '';
    } else {
      date_range = [filter_type, date_from + date_separator + date_to];
    }

    this.set_remove_filter(filter, date_range);
  },

  set_remove_filter: function(filter, value) {
    _primero.filters[filter] = value;

    if (_primero.filters[filter].length === 1 || _primero.filters[filter] === '') {
      delete _primero.filters[filter];
    }
  },

  set_array_filter: function(filter, value, type) {
    if (_.isArray(_primero.filters[filter])) {
      _primero.filters[filter].push(value);
    } else {
      _primero.filters[filter] = [type, value];
    }
  },

  change_scope: function(event) {
    var target = $(event.target),
        selected_val = target.val(),
        filter = target.attr('name'),
        filter_type = target.attr('filter_type') || 'single',
        self = this;

    // Checkboxes
    if (target.is(':checkbox')) {
      if (target.prop('checked')) {
        this.set_array_filter(filter, selected_val, filter_type);
      } else {
        this.set_remove_filter(filter, _.without(_primero.filters[filter], selected_val));
      }
    } else if ($(target).is("input") && $(target).hasClass('hasDatepicker')) {
      // Date Ranges
      var date_inputs = $(target).parents('.filter-controls').find('input');
      date_values = [ $(date_inputs[0]).val(), $(date_inputs[1]).val()];
      this.set_date_range(date_values, filter, filter_type);
    } else if ($(target).is("select") && filter_type === 'location'){
      if (selected_val === "") {
        filter_values = ""
      }
      else {
        filter_values = [filter_type, selected_val]
      }
      this.set_remove_filter(filter, filter_values);
    } else {
      // Everything else
      this.set_remove_filter(filter, $(target).val(), filter_type);
    }
  }
});
