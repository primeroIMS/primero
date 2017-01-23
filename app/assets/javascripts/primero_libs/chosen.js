_primero.chosen = function (selector) {
  //Initialize the chosen widget and set the code to manage when the user
  //clear the chosen selection.
  $(selector).chosen({display_selected_options:false, width:'100%', search_contains: true}).change(function() {
    //Input hidden to indicate that the user clear the chosen selection.
    var input_hidden_id = $(this).attr("id") + "_no_array"
    //Verify whether or not the user selects items.
    if ($(this).val() == null) {
      $(this).before(
        //Multiple select inputs will not be send to the server when has no options
        //selected, this makes not possible to set to nil/empty the corresponding
        //field in the database. In order to make that possible will create
        //a hidden input with empty value. By removing [] will not be interpreted
        //as array.
        $("<input>",
          {
            id: input_hidden_id,
            //strip [] to avoid be parsed as an array.
            name: $(this).attr("name").replace("[]", ""),
            value: "",
            type: "hidden"
          })
      );
    } else {
      //When the user selects something in the chosen, delete the hidden input
      //that allow to nil/empty the value in the database.
      $("#" + input_hidden_id).remove();
    }
  }).on('turbolinks:load', function() {
    //Small tweak to the search box. Initially has set some width that is not enough
    //to display the placeholder value.
    $(".chosen-container .search-field .default").css("width", "100%");
  });
}
