var IndexTable = Backbone.View.extend({

	pagination: pagination_details,

	el: 'body',

	events: {
		'change #record_state_scope': 'render_table',
	},

	initialize: function() {
		self = this;

		// init datatables
		this.list_view_table = $('.record_list_view').DataTable({
			searching: false,
			language: {
				info: self.pagination.info
			},
			lengthChange: false,
			pageLength: 20,
			primero_start: self.pagination.start,
			primero_total: self.pagination.total,
			responsive: true
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
	},
});

$(document).ready(function() {
	new IndexTable();
});
