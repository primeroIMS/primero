var IndexFilters = Backbone.View.extend({

  pagination: typeof pagination_details === 'undefined' ? false : pagination_details,

  el: '.page_content',

  form: 'form#index_filter_form',

  events: {
    'click .filter-controls input[type="checkbox"]': 'change_scope',
    'change .filter-controls input[type="text"]': 'change_scope',
    'change select[filter_type="location"]': 'change_scope',
    'click #apply_filter': 'apply_filters'
  },

  initialize: function() {
    this.set_current_scope();
    _primero.chosen('select.chosen-select:visible');
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

      if ($(this).is(':checkbox') && _.contains(current_scope, encodeURI($(this).val()))) {
        $(this).attr('checked', true);
        self.set_array_filter(name, $(this).val(), type);
      }

      if (type === 'date_range') {
        fields = $(this).parents('.filter-controls').find('input');
        current_scope = _.without(current_scope, type);
        if (current_scope.length > 0) {
          current_scope = current_scope[0].split('.');
          $(fields[0]).val(current_scope[0]);
          $(fields[1]).val(current_scope[1]);
          self.set_date_range(fields, name, type);
        }
      }
      else if (type === 'location') {
        if (current_scope !== false) {
          self.set_remove_filter(name, current_scope[0]);
        }
      }
    });
  },

  apply_filters: function(evt) {
    evt.preventDefault();

    var prev_params = _primero.clean_page_params(['scope']),
        url_string = _primero.object_to_params(_primero.filters),
        add_amp = '&';

    if (prev_params && url_string === '' || !prev_params || !prev_params && url_string === '') {
      add_amp = '';
    }
    window.location.search = prev_params + add_amp + url_string;
  },

  set_date_range: function(fields, filter, filter_type) {
    var date_from = $(fields[0]).val(),
      date_to = $(fields[1]).val(),
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
      this.set_date_range(date_inputs, filter, filter_type);
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

$(document).ready(function() {
  new IndexFilters();
});
