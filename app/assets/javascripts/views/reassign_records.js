_primero.Views.ReassignRecords = _primero.Views.Base.extend({

  el: 'body',

  events: {
    'click a.reassign_index_action': 'reassign_records',
    'click div#reassign-modal input[type="submit"]': 'transfer'
  },

  reassign_records: function(event) {
    var selected_recs = _primero.indexTable.get_selected_records();
    $("#reassign-modal").find("#selected_records").val(selected_recs);
  },

  transfer: function(e) {
    e.preventDefault();
    var local_user = $('div#reassign-modal select#existing_user').val(),
      localUserErrorDiv = $("div#reassign-modal .local_user_flash"),
      is_valid = true;

    if(local_user == null || local_user == undefined || local_user.trim() == ""){
      localUserErrorDiv.children(".error").text(I18n.t("reassign.user_mandatory")).css('color', 'red');
      localUserErrorDiv.show();
      is_valid = false;
    }

    if(is_valid){
      var modal = $('#reassign-modal');
      localUserErrorDiv.hide();
      $(e.target).parents('form').submit();
      modal.foundation('reveal', 'close');
      modal.find('form')[0].reset();
      window.disable_loading_indicator = true;
    } else {
      return false;
    }
  }
});