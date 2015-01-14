var ReportTable = Backbone.View.extend({

  el: '.reports',

  initialize: function() {
    this.init_report_table();
    this.init_report_chart();
  },

  events: {
    'click .report_export_graph': 'export_graph',
    'click .report_export_data': 'export_data'
  },

  init_report_table: function(){
    var self = this;
    this.report_table = $('#report_table');
    if (this.report_table.length){
      var dataTable = this.report_table.DataTable({
        "searching": false,
        "paging":   false,
        "ordering": false,
        "info":     false,
        "scrollX": '100%',
        "scrollY": '600px',
      });
      new $.fn.dataTable.FixedColumns(dataTable, {
        leftColumns: 1,
        rightColumns: 1
      });
    }
  },

  init_report_chart: function(){
    var self = this;
    var canvas = $("#report_graph");
    if (canvas.length){
      //TODO: AJAX call to the report data. Not really Backbone at all.
      var graph_url = window.location.pathname + '/graph_data'
      $.ajax(graph_url).done(function(graph_data){
        var colors = self.generateColors(graph_data.datasets.length);
        var context = canvas.get(0).getContext("2d");
        var options = {
          xAxisLabel: graph_data.aggregate,
          legend: true,
        };
        for (var i = 0; i < graph_data.datasets.length; i++){
          graph_data.datasets[i]['fillColor'] = colors[i];
        }
        var chart = new Chart(context).Bar(graph_data,options);

      }).fail(function(){
        canvas.parent().remove();
      });
    }
  },

  generateColors: function(number){
    //TODO: Less than 1 yeah yeah
    var result = [];
    if (number == 1){ result = ["rgba(151,187,205,1)"]; }
    else if (number == 2){ result = ["rgba(220,220,220,1)", "rgba(151,187,205,1)"]; }
    else if (number < 30){
      var map = Colormap({colormap: 'rainbow', nshades: 100, format: 'rgbaString'});
      var increment = Math.floor(100/number);
      for (var i = 0 ; i < map.length; i += increment){
        result.push(map[i]);
      }
    }
    else {
      result = Colormap({colormap: 'rainbow', nshades: number, format: 'rgbaString'});
    }
    return result;

  },

  export_graph: function(){
    var canvas = document.getElementById("report_graph");
    var imageURL = canvas.toDataURL("image/png");
    $("a.report_export_graph").attr("href", imageURL);
  },

  export_data: function(){
    var csvData = $('#report_table').table2CSV({delivery:'value'});
    var csvURL = 'data:text/csv;charset=utf8,' + encodeURIComponent(csvData);
    $("a.report_export_data").attr("href", csvURL);
  },


});

$(document).ready(function() {
  new ReportTable();
});

$(window).load( function () {
  //This is a hack to get DataTables and Foundation cooperating in aligning table header to table columns.
  //TODO: This is a bad place to put this code.
  var reportTable = $('#report_table');
  if (reportTable.length){
    reportTable.dataTable().fnAdjustColumnSizing( false );
  }
} );
