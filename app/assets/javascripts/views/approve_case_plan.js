_primero.Views.ApproveCasePlan = _primero.Views.Base.extend({

  el: '#menu',

  events: {
    'click div#approve-case-plan-modal input[type="submit"]' : 'submit_approval'
  },

  submit_approval: function(e) {
    e.preventDefault();
    $(e.target).parents('form').submit();
    $('#approve-case-plan-modal').foundation('reveal', 'close');
    $('#approve-case-plan-modal form')[0].reset();
    window.disable_loading_indicator = true;
  }
});