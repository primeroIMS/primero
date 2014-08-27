$(document).ready(function() {
  var photo_field_count = 1
  $('#add-photo').click(function(e) {
    e.preventDefault();
    var target = e.target || e.srcElement;
    var model = target.getAttribute("data-model");
    photo_field = "<div class='row'><div class='file medium-12 columns'><span class='tool-tip-label'><label class='key' for='" + model + "_photo"
                   + photo_field_count + "'>Add Photo</label></span><input id='" + model + "_photo" + photo_field_count
                   + "' name='" + model + "[photo]" + photo_field_count + "' type='file'></div></div>"
    $('#photo-group').append(photo_field)
    photo_field_count++;
    if(photo_field_count == 10)
      $(this).remove();
  });

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