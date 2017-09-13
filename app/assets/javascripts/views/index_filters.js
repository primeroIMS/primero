_primero.Views.IndexFilters = _primero.Views.Base.extend({

  pagination: typeof pagination_details === 'undefined' ? false : pagination_details,

  el: '.page_content',

  form: '#index_filter_form',

  events: {
    'click .filter-controls input[type="checkbox"]': 'change_scope',
    'change .filter-controls input[type="text"]': 'change_scope',
    'change select[filter_type="location"]': 'change_scope',
    'change select[filter_type="list"]': 'change_scope',
    'click #apply_filter': 'apply_filters',
    'click .clear_filters': 'clear_filters',
    'click .user_filter': 'get_filter'
  },

  initialize: function() {
    _primero.filters = {};
    this.set_current_scope();
    _primero.chosen('select.chosen-select:visible');


    // console.log(this.allow_save())
    // if (this.allow_save()) {
    //   $('.save_search').show();
    // } else {
    //   $('.save_search').hide();
    // }
  },

  //TODO: only show save if selected filters are applied
  // allow_save: function() {
  //   // TODO: find a better way of doing this when backend finished
  //   var default_filters = '?scope%5Bchild_status%5D=list%7C%7Copen&scope%5Brecord_state%5D=list%7C%7Ctrue';
  //   return location.search !== default_filters
  // },

  get_filter: function(e) {
    _primero.get_filter(e);
  },

   apply_filters: function(e) {
    _primero.apply_filters(e);
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

    if (_primero.model_object === 'child' || _primero.model_object === 'tracing_request') {
      filter[default_filter] = 'list||open';
      filter['record_state'] = 'list||true';
    }

    url_string = _primero.object_to_params(filter);
    Turbolinks.visit(window.location.pathname + '?' + url_string);
  },

  set_current_scope: function() {
    var self = this;

    $(this.form).find('input, select').each(function() {
      var $this = $(this);
      var name = $this.attr('name'),
          current_scope = _primero.get_param('scope[' + name + ']'),
          current_scope = current_scope ? current_scope.split('||') : false,
          type = $this.attr('filter_type') || 'single';

      if(_primero.getInternetExplorerVersion() != -1 &&  current_scope) {
        $(current_scope).each(function(i, ce){
          current_scope[i] = encodeURI(ce);
        });
      }

      if ($this.is(':checkbox') && $this.is(':checked')) {
        self.set_array_filter(name, $this.val(), type);
      }

      if ($this.is(':checkbox') && _.contains(current_scope, encodeURI($this.val()))) {
        $this.attr('checked', true);
        self.set_array_filter(name, $this.val(), type);
      }

      if($this.is('select') && type === 'list') {
        if (current_scope !== false) {
          $this.val(current_scope)
          self.set_remove_filter(name, current_scope)
        }
      }

      if (type === 'date_range') {
        fields = $this.parents('.filter-controls').find('input');
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
      else if (type === 'location' ) {
        if (current_scope !== false) {
          self.set_remove_filter(name, current_scope);
        }
      }
    });
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
    _primero.filters[filter] = _.isArray(value) ? _.uniq(value) : value;

    if (_primero.filters[filter].length === 1 || _primero.filters[filter] === '') {
      delete _primero.filters[filter];
    }
  },

  set_array_filter: function(filter, value, type) {
    if (_.isArray(_primero.filters[filter])) {
      if (!_.contains(_primero.filters[filter], value)) {
        _primero.filters[filter].push(value);
      }
    } else {
      _primero.filters[filter] = [type, value];
    }
  },

  change_scope: function(event) {
    var $target = $(event.target),
        selected_val = $target.val(),
        filter = $target.attr('name'),
        filter_type = $target.attr('filter_type') || 'single',
        self = this;

    // Checkboxes
    if ($target.is(':checkbox')) {
      if ($target.prop('checked')) {
        this.set_array_filter(filter, selected_val, filter_type);
      } else {
        this.set_remove_filter(filter, _.without(_primero.filters[filter], selected_val));
      }
    } else if ($target.is("input") && $target.hasClass('form_date_field')) {
      // Date Ranges
      var $date_inputs = $target.parents('.filter-controls').find('input');
      date_values = [ $($date_inputs[0]).val(), $($date_inputs[1]).val()];
      this.set_date_range(date_values, filter, filter_type);
    } else if ($target.is("select") && filter_type === 'list') {
      var filter_values = (selected_val) ? _.flatten([filter_type, selected_val]) : "";
      this.set_remove_filter(filter, filter_values);
    } else if ($target.is("select") && filter_type === 'location') {
      if (selected_val === "") {
        filter_values = ""
      }
      else {
        filter_values = [filter_type, selected_val]
      }
      this.set_remove_filter(filter, filter_values);
    } else {
      // Everything else
      this.set_remove_filter(filter, $target.val(), filter_type);
    }
  }
});
