_primero.Views.IdSearch = _primero.Views.Base.extend({
  el: '#ids-search',

  events: {
    'click #search-id': 'search_id'
  },

  search_id: function(e) {
    e.preventDefault();

    var target = $(e.target);

    target.parents('form').foundation('validateForm');

    var input = $('input[name="id_number"]');
    var params;

    if (input.val()) {
      params = {
        id_search: true,
        query: input.val(),
        module_id: target.data('module'),
        redirect_not_found: true
      }

      window.location.search = $.param(params);
    }
  }
});