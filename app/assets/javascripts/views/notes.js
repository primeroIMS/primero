_primero.Views.Notes = _primero.Views.Base.extend({

  el: 'body',

  events: {
    'click .notes_button' : 'add_notes',
    'click #notes-modal input[type="submit"]' : 'close_notes'
  },

  add_notes: function(event) {
    this.clear_notes();
    var $notes_button = $(event.target);
    var $notes_modal = $("#notes-modal");
  //  TODO
  },



  clear_notes: function(e) {
    var $referral_modal = $("#referral-modal");
  //  TODO
  },

  close_notes: function(e) {
    e.preventDefault();
    var $referral_modal = $('#referral-modal');
    var is_valid = true;

    //} else {
    //  //Require local user
    //  if(local_user == null || local_user == undefined || local_user.trim() == ""){
    //    $localUserErrorDiv.children(".error").text(I18n.t("referral.user_mandatory")).css('color', 'red');
    //    $localUserErrorDiv.show();
    //    is_valid = false;
    //  }
    //}
    //if(is_valid){
    //  $localUserErrorDiv.hide();
    //  $remoteUserErrorDiv.hide();
    //  $passwordErrorDiv.hide();
    //  $(e.target).parents('form').submit();
    //  $referral_modal.foundation('close');
    //  $referral_modal.find('form')[0].reset();
    //  $referral_modal.find('.remote_toggle').hide();
    //  $referral_modal.find('.local_toggle').show();
    //  window.disable_loading_indicator = true;
    //} else {
    //  return false;
    //}
  },

});
