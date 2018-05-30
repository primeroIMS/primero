_primero.Views.IndexTable = _primero.Views.Base.extend({

  el: 'body',

  events: {
    'change #record_scope': 'change_scope',
    'change .dataTables_length select': 'change_display_count',
    'click .dataTable th': 'change_sorting',
    'click .dropdown_link': 'dropdown_links'
  },

  initialize: function() {
    var self = this;

    this.pagination = typeof window.pagination_details == 'undefined' ? false : window.pagination_details;

    this.init_index_tables();
    this.disable_table_alerts();
    this.init_other_tables();
    this.set_current_scope();
    this.set_current_sort();
    this.agency_sortable();
  },

  agency_sortable: function() {
    var $rows = $("#list_table.agency").find("tbody");
    $rows.sortable({
      update: function(){
        $.post('/agencies/update_order', $(this).sortable('serialize'));
      }
    });
  },

  disable_table_alerts: function() {
    // Disable datatables alert
    $.fn.dataTableExt.sErrMode = 'throw';
    window.t = this.list_view_table;
  },

  init_index_tables: function() {
    self = this;

    var $list_table = $('.record_list_view:not(.dont_page)');
    
    // init datatables
    this.list_view_table = $list_table.DataTable({
      destroy: true,
      searching: false,
      language: {
        info: self.pagination.info,
        lengthMenu: self.pagination.per_translation,
        paginate: {
          previous: "&lt;",
          next: "&gt;"
        }
      },
      pageLength: self.pagination.per,
      primero_start: self.pagination.start,
      primero_total: self.pagination.total,
      responsive: true,
      aaSorting: [],
      sDom: 'frtlp',
      lengthMenu: [ 20, 50, 75, 100 ]
    }).draw();
  },

  init_other_tables: function() {
    self = this;

    var $other_tables = $('.list_view, .list_table');

    // for non child/incident
    this.other_tables = $other_tables.DataTable({
      destroy: true,
      searching: false,
      lengthChange: false,
      "ordering": false,
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

    var search = prev_params + '&scope[' + scope[0]  + ']=' + scope[1];
    Turbolinks.visit(window.location.pathname + '?' + search);
  },

  change_display_count: function(event) {
    event.preventDefault();
    var prev_params = _primero.clean_page_params(['page', 'per']),
        select_val = $(event.target).val();
    var search = prev_params + '&per=' + select_val;
    Turbolinks.visit(window.location.pathname + '?' + search);
  },

  change_sorting: function(event) {
    var $column = $(event.target),
        order = $column.attr('aria-sort'),
        redraw = false,
        prev_params = _primero.clean_page_params(['order', 'column', 'col_idx']),
        column_field = $column.attr('aria-field'),
        column_field_idx = $column.attr('aria-field-index');
    if ($column.attr("type") != "checkbox") {
      event.preventDefault();
    }

    order = order == 'ascending' ? 'asc' : 'desc';
    // Disable the sorting for the Violations and Photo columns
    if (column_field != 'violations' && column_field != 'photo' && column_field != 'select' && column_field != 'tracing_names'){
      var search = prev_params + '&order=' + order + '&column=' + column_field + '&col_idx=' + column_field_idx;
      Turbolinks.visit(window.location.pathname + '?' + search);
    }
  },

  get_selected_records: function(){
    var selected_records = [];
    $('input.select_record:checked').each(function(){
      selected_records.push($(this).val());
    });
    return selected_records;
  },

  dropdown_links: function(event) {
    var $dropdown_link = $(event.target);
    Turbolinks.visit($dropdown_link.attr('data-link'));
  }
});
