var DocumentUploadField = Backbone.View.extend({
  el: '.page_content form',
  events: {
    'change input.file_upload_input' : 'update_file_path_label',
    'click a#add-document' : 'add_document_upload_field',
    'change div#file-group input[type="file"]' : 'validate_document'
  },

  update_file_path_label: function(event) {
    var target = event.target;
    var id = $(target).attr('id');
    $('#' + id + '_file_path').text(target.value);
  },

  add_document_upload_field: function(event) {
    event.preventDefault();
    var action_link = $(event.target);
    var file_group = action_link.parents('#file_container').find('div#file-group');
    var new_document_upload_box = file_group.find('div.file:first-child').clone();
    var upload_inputs_count = file_group.find('div.file').length;
    var new_document_input = new_document_upload_box.find('input[type="file"]').val(''); //.attr('id', 'child_upload_document_' + upload_inputs_count + 'document');
    var new_document_description = new_document_upload_box.find('input[type="text"]').val('');//.attr('id', 'child_upload_document_' + upload_inputs_count + '');
    $([new_document_input, new_document_description]).each(function(){
      var labels = new_document_upload_box.find('label[for="' + $(this).attr('id') + '"]');
      var id = $(this).attr('id').replace(/_[0-9]_/, "_" + upload_inputs_count + "_");
      var name = $(this).attr('name').replace(/\[[0-9]\]/, "[" + upload_inputs_count + "]");
      $(this).attr('id', id);
      $(this).attr('name', name);
      labels.each(function(){
        var label = $(this);
        var label_id = label.attr('id');
        if (label_id != undefined) {
          label.attr('id', label_id.replace(/_[0-9]_/, "_" + upload_inputs_count + "_"));
          label.text(label.data('default_text'));
        }
        $(this).attr('for', id);
      });
    });
    file_group.append(new_document_upload_box);
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

$(document).ready(function(){
  new DocumentUploadField();
})