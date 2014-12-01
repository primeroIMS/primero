$(document).ready(function() {
  //Check the current audio for delete will disable the input file and clear it.
  $(".audio_player_section .audio .delete_check_box input[type='checkbox']" ).on("click", function() {
    var model = $(this).attr("data-model");
    if ($(this).attr('checked')) {
      $("fieldset[id$='photos_and_audio'] .file #" + model + "_audio").attr('disabled', 'disabled');
      $("fieldset[id$='photos_and_audio'] .file #" + model + "_audio").val("");
    } else {
      $("fieldset[id$='photos_and_audio'] .file #" + model + "_audio").removeAttr('disabled');
    }
  });
});