$(document).ready(function() {

  /**************************************************************************************
  * DataTables
  */
	var pagination = typeof pagination_details == 'undefined' ? false : pagination_details
	
	var entity_table = $('.list_view').DataTable({
		searching: false,
		language: {
      info: pagination.info
  	},
  	lengthChange: false,
		pageLength: 20,
		primero_page: pagination.current_page,
		primero_pages: pagination.total_pages,
		responsive: true
	});
});

_primero.update_subform_heading = function(subformEl) {
  //Update the static text with the corresponding input value to shows the changes if any.
  $(subformEl).find(".collapse_expand_subform_header div.display_field span").each(function(x, el){
    //view mode doesn't sent this attributes, there is no need to update the header.
    var data_types_attr = el.getAttribute("data-types");
    var data_fields_attr = el.getAttribute("data-fields");
    if (data_types_attr != null && data_fields_attr != null) {
      //retrieves the fields to update the header.
      var data_types = data_types_attr.split(",");
      var data_fields = data_fields_attr.split(",");
      var values = [];
      for (var i=0; (data_fields.length == data_types.length) && (i < data_fields.length); i++) {
        var input_id = data_fields[i];
        var input_type = data_types[i];
        if (input_type == "chosen_type") {
          //reflect changes of the chosen.
          var input = $(subformEl).find("select[id='" + input_id + "_']");
          if (input.val() != null) {
            values.push(input.val().join(", "));
          }
        } else if (input_type == "radio_button_type") {
          //reflect changes of the for radio buttons.
          var input = $(subformEl).find("input[id^='" + input_id + "']:checked");
          if (input.size() > 0) {
            values.push(input.val());
          }
        } else if (input_type == "check_boxes_type") {
          //reflect changes of the checkboxes.
          var checkboxes_values = [];
          $(subformEl).find("input[id^='" + input_id + "']:checked").each(function(x, el){
            checkboxes_values.push($(el).val());
          });
          if (checkboxes_values.length > 0) {
            values.push(checkboxes_values.join(", "));
          }
        } else {
          //Probably there is other widget that should be manage differently.
          var input = $(subformEl).find("#" + input_id);
          if (input.val() != "") {
            values.push(input.val());
          }
        }
      }
      $(el).text(values.join(" - "));

      // find violation id field and update it
      violationIdEl = $(subformEl).find("input[id$='_violation_id']");
      violationIdEl.val(values.join(" - "));
    }
  });
}

