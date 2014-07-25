$(document).ready(function() {

  /**************************************************************************************
  * DataTables
  */
	var pagination = typeof pagination_details == 'undefined' ? false : pagination_details
	
	$('.list_view, .list_table').DataTable({
		searching: false,
		"language": {
    	"info": pagination.info
  	}
	});
});