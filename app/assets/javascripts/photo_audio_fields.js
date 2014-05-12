$(document).ready(function() {
  var photo_field_count = 1
  $('#add-photo').click(function(e) {
    e.preventDefault();
    photo_field = "<div class='row'><div class='file medium-12 columns'><span class='tool-tip-label'><label class='key' for='child[photo]"
                   + photo_field_count + "'>Add Photo</label></span><input id='child_photo" + photo_field_count
                   + "' name='child[photo]" + photo_field_count + "' type='file'></div></div>"
    $('#photo-group').append(photo_field)
    photo_field_count++;
    if(photo_field_count == 5)
      $(this).remove();
  });
});