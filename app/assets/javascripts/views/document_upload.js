_primero.Views.FileUploadField = _primero.Views.Base.extend({
  el: '.page_content form',
  events: {
    'change input.file_upload_input': 'update_file_path_label',
    'click #add-file-upload-field': 'add_file_upload_field',
    'change #file-group.document input[type="file"]': 'validate_document'
  },

  update_file_path_label: function (event) {
    var target = event.target;
    var id = $(target).attr('id');
    var display_value = target.value.split('\\').slice(-1)[0];
    $('#' + id + '_file_path').text(display_value);
  },

  add_file_upload_field: function (event) {
    event.preventDefault();
    var action_link = $(event.target);
    var $file_group = action_link.parents('#file_container').find('#file-group');
    var $new_file_upload_field = $file_group.find('.file:last-child').clone();
    var upload_inputs_count = $file_group.find('.file').length;
    var new_file_input = $new_file_upload_field.find('input[type="file"]').val('');
    var new_file_is_current = $new_file_upload_field.find('input[tag="is_current"]').val('');
    var new_file_description = $new_file_upload_field.find('input[tag="description"]').val('');
    var new_file_date = $new_file_upload_field.find('input[tag="date"]').val('');
    var new_file_comments = $new_file_upload_field.find('textarea[tag="comments"]').val('');

    $([new_file_input, new_file_is_current, new_file_description, new_file_date, new_file_comments]).each(function () {
      var $input = $(this);
      if ($input.length > 0) {
        var labels = $new_file_upload_field.find('label[for="' + $input.attr('id') + '"]');
        var id = $input.attr('id').replace(/[0-9]/, upload_inputs_count);
        var name = $input.attr('name').replace(/[0-9]/, upload_inputs_count);
        $input.attr({
          id: id,
          name: name
        });
        labels.each(function () {
          var $label = $(this);
          var label_id = $label.attr('id');
          if (label_id != undefined) {
            $label.attr('id', label_id.replace(/[0-9]/, upload_inputs_count));
            $label.text($label.data('default-text'));
          }
          $(this).attr('for', id);
        });
      }
    });
    $file_group.append($new_file_upload_field);
    if ($file_group.find('.file').length >= 10) {
      action_link.remove();
    }
  },

  validate_document: function (event) {
    var $document_input = $(event.target);
    if ($document_input.val().toLowerCase().match(/.exe$/) != null) {
      $document_input.val('');
      this.update_file_path_label(event);
      $('#document_upload_box_file_extension_popup_message').dialog({ resizable: false });
    } else if (($document_input[0].files[0].size / 1024) > (1024 * 2)) {
      $document_input.val('');
      this.update_file_path_label(event);
      $('#document_upload_box_file_size_popup_message').dialog({ resizable: false });
    }
  }
});
