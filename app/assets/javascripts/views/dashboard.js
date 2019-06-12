_primero.Views.Dashboard = _primero.Views.Base.extend({

    el: '#dashboard',

    events: {
      'change #protection_concerns_location' : 'on_location_change',
    },

    initialize: function(){
        this.align_dashboard();
    },

    align_dashboard: function(){
        var panels = this.$el.find('.panel');
        for (var i = 0; i < panels.size(); i++){
            this.align_dashboard_columns($(panels[i]));
        }
    },

    align_dashboard_columns: function(panel){
        var headers = panel.find('.panel_header table th');
        var firstRow = panel.find('.panel_content table tbody tr:first-child td');

        var columnWidths = [];
        for (var i = 0; i < headers.size(); i++){
            var headerWidth = $(headers[i]).width();
            var columnWidth = $(firstRow[i]).width();
            columnWidths[i] = Math.max(headerWidth, columnWidth);
            $(headers[i]).width(columnWidths[i]);
        }

        var rows = panel.find('.panel_content table tbody tr td');
        for (var i = 0; i < rows.size(); i++) {
            var width = columnWidths[i%(columnWidths.length)];
            $(rows[i]).width(width);
        }
    },

    on_location_change: function(e) {
      var select = $(e.target)
      if(select.val()) {

        Turbolinks.visit(window.location.pathname + '?protection_concerns_location=' + select.val());
      }

    }

});
