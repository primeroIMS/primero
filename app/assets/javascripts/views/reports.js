_primero.Views.ReportTable = _primero.Views.Base.extend({

  el: '.reports',

  events: {
    'click .report_export_graph': 'export_graph',
    'click .report_export_data': 'export_data'
  },

  initialize: function() {
    this.init_report_table();
    this.init_report_chart();

    function resize_window(event, tab) {
      $(window).trigger('resize');
    }

    $('.tabs').on('change.zf.tabs', resize_window);
  },

  resize_window: function (event, tab) {
    $(window).trigger('resize');
  },

  init_report_table: function() {
    var self = this;
    this.report_table = $('#report_table');

    if (this.report_table.length) {
      var dataTable = this.report_table.DataTable({
        "searching": false,
        "paging":   false,
        "ordering": false,
        "info":     false,
        "scrollX": true,
        "scrollY": '500px',
      });
      if (this.report_table.find('tr:last td').length > 8) {
        new $.fn.dataTable.FixedColumns(dataTable, {
          leftColumns: 1,
          rightColumns: 1,
          heightMatch: "auto"
        });
      }
    }
  },

  init_report_chart: function(){
    var self = this;
    var $canvas = $("#report_graph");
    if ($canvas.length) {
      $('.spacer').height(0)
      //TODO: AJAX call to the report data. Not really Backbone at all.
      var graph_url = window.location.pathname + '/graph_data' + window.location.search
      $.ajax(graph_url).done(function(graph_data){
        var colors = self.generateColors(graph_data.datasets.length);
        var context = $canvas.get(0).getContext("2d");
        var options = {
          xAxisLabel: graph_data.aggregate,
          graphMin: 0,
          legend: true,
          yAxisMinimumInterval: 1
        };
        for (var i = 0; i < graph_data.datasets.length; i++){
          graph_data.datasets[i]['fillColor'] = colors[i];
        }

        for(var j = 0; j < graph_data.labels.length; j++) {
            graph_data.labels[j] = graph_data.labels[j].trunc(28);
        }

        var chart = new Chart(context).Bar(graph_data,options);

      }).fail(function(){
        $canvas.parent().remove();
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

  export_graph: function(e){
    e.preventDefault();

    var canvas = document.getElementById("report_graph");
      canvas_name = this.document_file_name();

    canvas.toBlob(function(blob) {
      saveAs(blob, canvas_name[0] + '-' + canvas_name[1] + ".png");
    });
  },

  export_data: function(e){
    e.preventDefault();

    var csvData = $('#report_table').table2CSV({delivery:'value'});
    var name = this.document_file_name();
    var blob = new Blob([csvData], {type: "text/csv;charset=utf-8"});
    saveAs(blob, name[0] + '-' + name[1] + ".csv");
  },

  document_file_name: function() {
    return location.pathname.replace(/\//, '').split('/');
  }


});

$(window).on('load', function () {
  //This is a hack to get DataTables and Foundation cooperating in aligning table header to table columns.
  //TODO: This is a bad place to put this code.
  var $reportTable = $('#report_table');
  if ($reportTable.length){
    $reportTable.dataTable().fnAdjustColumnSizing( false );
  }
});
