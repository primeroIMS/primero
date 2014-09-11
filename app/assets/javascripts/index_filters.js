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
          current_scope = _primero.get_param('scope[' + name + ']');
          current_scope = current_scope ? current_scope.split(',') : false;

      if ($(this).is(':checkbox') && _.indexOf(current_scope, encodeURI($(this).val())) > -1) {
        $(this).prop('checked', true);
        self.set_array_filter(name, $(this).val());
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

  set_remove_filter: function(condition, filter, value) {
    this.filters[filter] = value;

    if(condition) {
      delete this.filters[filter];
    } else {
      return false;
    }
  },

  set_array_filter: function(filter, value) {
    if (_.isArray(this.filters[filter])) {
      this.filters[filter].push(value);
    } else {
      this.filters[filter] = [value];
    }
  },

  change_scope: function(event) {
    var target = $(event.target),
        selected_val = target.val(),
        filter = target.attr('name');

    // Checkboxes
    if (target.is(':checkbox')) {
      if (target.prop('checked')) {
        this.set_array_filter(filter, selected_val);
      } else {
        this.set_remove_filter((this.filters[filter].length === 0), filter,
            _.without(this.filters[filter], selected_val));
      }
    } else if ($(target).is("input") && $(target).hasClass('hasDatepicker')) {
      // Date Ranges
      var date_inputs = $(target).parents('.filter-controls').find('input');

      this.set_remove_filter((!$(date_inputs[0]).val() && !$(date_inputs[0]).val()), filter,
              $(date_inputs[0]).val() + '...' + $(date_inputs[1]).val());
    } else {
      // Everything else
      this.set_remove_filter((!input_val), filter, $(target).val());
    }
  }
});

$(document).ready(function() {
  new IndexFilters();
});
