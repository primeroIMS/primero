var IndexTable = Backbone.View.extend({

  pagination: typeof pagination_details == 'undefined' ? false : pagination_details,

  el: 'body',

  events: {
    'change #record_scope': 'change_scope',
    'change .dataTables_length select': 'change_display_count',
    'click th': 'change_sorting'
  },

  initialize: function() {
    this.init_index_tables();
    this.disable_table_alerts();
    this.init_other_tables();
    this.set_current_scope();
    this.set_current_sort();
  },

  disable_table_alerts: function() {
    // Disable datatables alert
    $.fn.dataTableExt.sErrMode = 'throw';
    window.t = this.list_view_table;
  },

  init_index_tables: function() {
    self = this;

    // init datatables
    this.list_view_table = $('.record_list_view').DataTable({
      searching: false,
      language: {
        info: self.pagination.info,
        lengthMenu: self.pagination.per_translation
      },
      pageLength: self.pagination.per,
      primero_start: self.pagination.start,
      primero_total: self.pagination.total,
      responsive: true,
      aaSorting: [],
      sDom: 'frtlp',
    });
  },

  init_other_tables: function() {
    self = this;

    // for non child/incident
    $('.list_view, .list_table').DataTable({
      searching: false,
      lengthChange: false,
      "language": {
        "info": self.pagination.info
      }
    });
  },

  set_current_scope: function() {
    current_scope = _primero.get_param('scope');
    current_scope = current_scope ? current_scope.replace('scope[', '').replace(']', '') : false
    if (current_scope) {
      $('#record_scope').val(decodeURI(current_scope));
    }
  },

  set_current_sort: function() {
    current_order = _primero.get_param('order')
    current_column = _primero.get_param('column')
    current_column_idx = _primero.get_param('col_idx')

    if (current_order && current_column && current_column_idx) {
      this.list_view_table.order([current_column_idx, current_order])
      this.list_view_table.draw();
    }
  },

  change_scope: function(event) {
    var select_val = $(event.target).val(),
        scope = select_val.split(':'),
        prev_params = _primero.clean_page_params(['scope']);

    window.location.search = prev_params + '&scope[' + scope[0]  + ']=' + scope[1];
  },

  change_display_count: function(event) {
    event.preventDefault();
    var prev_params = _primero.clean_page_params(['page', 'per']),
        select_val = $(event.target).val();
    window.location.search = prev_params + '&per=' + select_val;
  },

  change_sorting: function(event) {
    event.preventDefault();
    var column = $(event.target),
        order = column.attr('aria-sort'),
        redraw = false,
        prev_params = _primero.clean_page_params(['order', 'column', 'col_idx']),
        column_field = column.attr('aria-field'),
        column_field_idx = column.attr('aria-field-index');

    order = order == 'ascending' ? 'asc' : 'desc';
    window.location.search = prev_params + '&order=' + order + '&column=' + column_field + '&col_idx=' + column_field_idx;
  }
});

$(document).ready(function() {
  new IndexTable();
});
