var IndexTable = Backbone.View.extend({

	pagination: typeof pagination_details == 'undefined' ? false : pagination_details,

	el: 'body',

	events: {
		'change #record_state_scope': 'render_table',
		'change .dataTables_length select': 'change_display_count'
	},

	initialize: function() {
		self = this;

		// init datatables
		this.list_view_table = $('.record_list_view').DataTable({
			searching: false,
			language: {
				info: self.pagination.info
			},
			pageLength: self.pagination.per,
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

	clean_page_params: function(clean_param) {
			var source = location.href,
	  			rtn = source.split("?")[0],
	        param,
	        params_arr = [],
	        query = (source.indexOf("?") !== -1) ? source.split("?")[1] : "";
	    if (query !== "") {
	        params_arr = query.split("&");
	        for (var i = params_arr.length - 1; i >= 0; i -= 1) {
	            param = params_arr[i].split("=")[0];
	            for(var j = 0; j < clean_param.length; j++) {
	            	console.log(clean_param[j], param)
		            if (param === clean_param[j]) {
		                params_arr.splice(i, 1);
		            }
	          	}
	        }
	        rtn = params_arr.join("&");
	    } else {
	    	rtn = "";
	    }
	    return rtn;
	},

	change_display_count: function(event) {
		event.preventDefault();
		var prev_params = this.clean_page_params(['page', 'per']),
				select_val = $(event.target).val();
		console.log(prev_params)
		window.location.search = prev_params + '&per=' + select_val;
	}
});

$(document).ready(function() {
	new IndexTable();
});
