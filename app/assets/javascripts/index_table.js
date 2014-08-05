var IndexTable = Backbone.View.extend({

	pagination: typeof pagination_details == 'undefined' ? false : pagination_details,

	el: 'body',

	events: {
		'change #record_state_scope': 'render_table',
	},

	initialize: function() {
		self = this;

		// init datatables
		var list_view = $('.record_list_view');
	  this.list_view_table = list_view.DataTable({
	    searching: false,
	    lengthChange: false,
	    pageLength: 20,   
	    serverSide: true,
	    deferRender: true,
	    stateSave: true,
	    ajax: list_view.data('source'),
	    fnServerParams: function (aoData) {
	    	var scope = aoData.scope = {};
	      scope.record_state = $('#record_state_scope').val();
	    },
	    language: {
	      info: pagination_info.default,
	      infoEmpty: pagination_info.empty
	    },
	    columnDefs: index_column_defs,
	    columns: index_columns,
	    order: index_default_order
	  });

	  // Disable datatables alert
  	$.fn.dataTableExt.sErrMode = 'throw';
  	window.t = this.list_view_table;
  	// for non child/incident
		$('.list_view, .list_table').DataTable({
			searching: false,
			lengthChange: false,
			"language": {
	    	"info": this.pagination.info
	  	}
		});
	},

	render_table: function(event) {
		this.list_view_table.draw();
	},
});

$(document).ready(function() {
	new IndexTable();
});
