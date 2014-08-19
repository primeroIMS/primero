var DocumentUploadField = Backbone.View.extend({
  el: '.page_content form',
  events: {
    'click a#add-document' : 'add_document_upload_field'
  },

  add_document_upload_field: function(event) {
    event.preventDefault();
    action_link = $(event.target);
    file_group = action_link.parent().find('div#file-group');
    new_document_upload_field = file_group.find('div.row:first').clone();
    upload_inputs_count = file_group.find('div.row').length + 1;
    new_document_upload_field.find('input[type="file"]').val('').attr('id', 'child_upload_document_' + upload_inputs_count);
    file_group.append(new_document_upload_field);
  }
});

$(document).ready(function(){
  new DocumentUploadField();
})