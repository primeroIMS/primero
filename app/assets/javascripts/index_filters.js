var IndexFilters = Backbone.View.extend({

  pagination: typeof pagination_details === 'undefined' ? false : pagination_details,

  el: 'body',

  form: 'form#index_filter_form',

  events: {
    'click .filter-controls input[type="checkbox"]': 'change_scope',
    'change .filter-controls input[type="text"]': 'change_scope',
    'click #apply_filter': 'apply_filters'
  },

  initialize: function() {
    this.set_current_scope();
  },

  filters: {},

  set_current_scope: function() {
    var self = this;

    $(this.form).find('input').each(function() {
      var name = $(this).attr('name'),
          current_scope = _primero.get_param('scope[' + name + ']'),
          current_scope = current_scope ? current_scope.split(',') : false,
          type = $(this).attr('filter_type') || 'single';

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
    });
  },

  object_to_params:function() {
    var url_string = "";
    for (var key in this.filters) {
      if (url_string !==  "") {
        url_string += "&";
      }
      url_string += "scope[" + key + "]" + "=" + this.filters[key];
    }
    return url_string;
  },

  apply_filters: function(evt) {
    evt.preventDefault();

    var prev_params = _primero.clean_page_params(['scope']),
        url_string = this.object_to_params(),
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
    this.filters[filter] = value;

    if (this.filters[filter].length === 1 || this.filters[filter] === '') {
      delete this.filters[filter];
    }
  },

  set_array_filter: function(filter, value, type) {
    if (_.isArray(this.filters[filter])) {
      this.filters[filter].push(value);
    } else {
      this.filters[filter] = [type, value];
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
        this.set_remove_filter(filter, _.without(self.filters[filter], selected_val));
      }
    } else if ($(target).is("input") && $(target).hasClass('hasDatepicker')) {
      // Date Ranges
      var date_inputs = $(target).parents('.filter-controls').find('input');
      this.set_date_range(date_inputs, filter, filter_type);
    } else {
      // Everything else
      this.set_remove_filter(filter, $(target).val(), filter_type);
    }
  }
});

$(document).ready(function() {
  new IndexFilters();
});
