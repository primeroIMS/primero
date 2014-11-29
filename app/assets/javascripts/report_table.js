var ReportTable = Backbone.View.extend({

  el: '.report_table',

  initialize: function() {
    this.init_report_table();
  },

  init_report_table: function(){
    self = this;
    this.report_table = $('table.report_table').DataTable({
      "searching": false,
      "paging":   false,
      "ordering": false,
      "info":     false,
      "scrollX": true,
    });
    new $.fn.dataTable.FixedColumns(this.report_table);
  }


});

$(document).ready(function() {
  new ReportTable();
});