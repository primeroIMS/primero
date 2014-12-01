var ReportTable = Backbone.View.extend({

  el: '.reports',

  initialize: function() {
    this.init_report_table();
    this.init_report_chart();
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
  },

  init_report_chart: function(){
    self = this;
    canvas = $("#report_graph");
    if (canvas.length){
      //TODO: AJAX call to the report data. Not really Backbone at all.
      var graph_url = window.location.href.toString().split(window.location.host)[1] + '/graph_data'
      $.ajax(graph_url).done(function(graph_data){
        //TODO: These are all default options and need to be prettied up!
        var options = {
          //Boolean - Whether the scale should start at zero, or an order of magnitude down from the lowest value
          scaleBeginAtZero : true,
          //Boolean - Whether grid lines are shown across the chart
          scaleShowGridLines : true,
          //String - Colour of the grid lines
          scaleGridLineColor : "rgba(0,0,0,.05)",
          //Number - Width of the grid lines
          scaleGridLineWidth : 1,
          //Boolean - If there is a stroke on each bar
          barShowStroke : true,
          //Number - Pixel width of the bar stroke
          barStrokeWidth : 2,
          //Number - Spacing between each of the X value sets
          barValueSpacing : 5,
          //Number - Spacing between data sets within X values
          barDatasetSpacing : 1,
          //String - A legend template
          legendTemplate : "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<datasets.length; i++){%><li><span style=\"background-color:<%=datasets[i].lineColor%>\"></span><%if(datasets[i].label){%><%=datasets[i].label%><%}%></li><%}%></ul>"
        };
        var context = canvas.get(0).getContext("2d");
        var chart = new Chart(context).Bar(graph_data,options);
      }).fail(function(){
        canvas.parent().remove();
      });
    }
  }


});

$(document).ready(function() {
  new ReportTable();
});