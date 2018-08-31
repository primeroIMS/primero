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
  },



  clear_notes: function(e) {
    var $referral_modal = $("#referral-modal");
  //  TODO
  },

  close_notes: function(e) {
    e.preventDefault();
    var $notes_modal = $('#notes-modal');

    $(e.target).parents('form').submit();
    $notes_modal.foundation('close');
  },

});
