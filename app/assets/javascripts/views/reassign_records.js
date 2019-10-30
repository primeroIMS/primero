_primero.Views.ReassignRecords = _primero.Views.Base.extend({

  el: 'body',

  events: {
    'click .reassign_index_action': 'reassign_records',
    'click .reassign_show_action': 'clear_reassign',
    'click #reassign-modal input[type="submit"]': 'transfer'
  },

  initialize: function () {
    var self = this;
    $('#reassign-modal').on('closeme.zf.reveal', self.clear_modal);
  },

  reassign_records: function(event) {
    var selected_recs = _primero.indexTable.get_selected_records();
    var $modal = $("#reassign-modal");
    $modal.find("#selected_records").val(selected_recs);
    this.clear_reassign();
  },

  clear_reassign: function(e){
    var $modal = $("#reassign-modal");
    $modal.find('#existing_user_reassign').val('')
    $modal.find('#existing_user_reassign').trigger('chosen:updated');
  },

  transfer: function(e) {
    e.preventDefault();
    var $modal = $("#reassign-modal");
    var local_user = $modal.find('#existing_user_reassign').val(),
      localUserErrorDiv = $modal.find(".local_user_flash"),
      is_valid = true;

    if(local_user == null || local_user == undefined || local_user.trim() == ""){
      localUserErrorDiv.children(".error").text(I18n.t("reassign.user_mandatory")).css('color', 'red');
      localUserErrorDiv.show();
      is_valid = false;
    }

    if(is_valid){
      localUserErrorDiv.hide();
      $(e.target).parents('form').submit();
      $modal.foundation('close');
      $modal.find('form')[0].reset();
      window.disable_loading_indicator = true;
    } else {
      return false;
    }
  },

  clear_modal: function () {
    var $reassign_modal = $('#reassign-modal');

    var $existing_user_select = $reassign_modal.find('#existing_user');
    $existing_user_select.val('');
    $existing_user_select.trigger('chosen:updated');
    $reassign_modal.find('#notes').val('');
  }
});
