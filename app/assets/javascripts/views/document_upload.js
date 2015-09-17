_primero.Views.FileUploadField = Backbone.View.extend({
  el: '.page_content form',
  events: {
    'change input.file_upload_input' : 'update_file_path_label',
    'click a#add-file-upload-field' : 'add_file_upload_field',
    'change div#file-group.document input[type="file"]' : 'validate_document'
  },

  update_file_path_label: function(event) {
    var target = event.target;
    var id = $(target).attr('id');
    $('#' + id + '_file_path').text(target.value);
  },

  add_file_upload_field: function(event) {
    event.preventDefault();
    var action_link = $(event.target);
    var file_group = action_link.parents('#file_container').find('div#file-group');
    var new_file_upload_field = file_group.find('div.file:first-child').clone();
    var upload_inputs_count = file_group.find('div.file').length;
    var new_file_input = new_file_upload_field.find('input[type="file"]').val('');
    var new_file_description = new_file_upload_field.find('input[type="text"]').val('');
    $([new_file_input, new_file_description]).each(function(){
      var input = $(this);
      if (input.length > 0) {
        var labels = new_file_upload_field.find('label[for="' + input.attr('id') + '"]');
        var id = input.attr('id').replace(/[0-9]/, upload_inputs_count);
        var name = input.attr('name').replace(/[0-9]/, upload_inputs_count);
        $(this).attr('id', id);
        $(this).attr('name', name);
        labels.each(function(){
          var label = $(this);
          var label_id = label.attr('id');
          if (label_id != undefined) {
            label.attr('id', label_id.replace(/[0-9]/, upload_inputs_count));
            label.text(label.data('default-text'));
          }
          $(this).attr('for', id);
        });
      }
    });
    file_group.append(new_file_upload_field);
    if (file_group.find('div.file').length >= 10) {
      action_link.remove();
    }
    _primero.set_content_sidebar_equality();
  },

  validate_document: function(event) {
    var document_input = $(event.target);
    if (document_input.val().toLowerCase().match(/.exe$/) != null) {
      document_input.val('');
      $('div#document_upload_box_file_extension_popup_message').dialog({ resizable: false });
    } else if ((document_input[0].files[0].size/1024) > 10240) {
      document_input.val('');
      $('div#document_upload_box_file_size_popup_message').dialog({ resizable: false });
    }
  }
});