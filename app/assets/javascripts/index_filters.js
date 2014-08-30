var IndexFilters = Backbone.View.extend({

  pagination: typeof pagination_details == 'undefined' ? false : pagination_details,

  el: '.index_filters',

  form: 'form#index_filter_form',

  events: {
    'click input[type="checkbox"': 'change_scope'
  },

  initialize: function() {
    this.set_current_scope();
  },

  set_current_scope: function() {
    $(this.form).find('input').each(function() {
      var name = $(this).attr('name'),
          current_scope = _primero.get_param('scope[' + name + ']');
          current_scope = current_scope ? current_scope.split(',') : false;

      if ($(this).is(':checkbox') && _.indexOf(current_scope, $(this).val()) > -1) {
        $(this).prop('checked', true)
      }
    });
  },

  change_scope: function(event) {
    var target = $(event.target),
        selected_val = target.val(),
        filter = target.attr('name'),
        prev_params = _primero.clean_page_params(['scope[' + filter + ']']);

    // Checkboxes
    if (target.is(':checkbox')) {
      var checked = $(event.target + ':checked');

      if (checked.length > 0) {
        prev_checked = _primero.get_param('scope[' + filter + ']');
        prev_checked = prev_checked ? prev_checked.split(',') : [];

        if (target.prop('checked')) {
          prev_checked.push(selected_val);
        } else {
          prev_checked = _.without(prev_checked, selected_val);  
        }

        current_checked = _.uniq(prev_checked);
        current_checked.length > 0 ?
          window.location.search = prev_params + '&scope[' + filter  + ']=' + current_checked
          : window.location.search = prev_params;
      } else {
        window.location.search = prev_params
      }
    }
  }
});

$(document).ready(function() {
  new IndexFilters();
});
