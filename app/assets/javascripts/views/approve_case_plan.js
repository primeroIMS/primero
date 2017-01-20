_primero.Views.ApproveCasePlan = Backbone.View.extend({

  el: '#menu',

  events: {
    'click #approve-case-plan-modal input[type="submit"]' : 'submit_approval'
  },

  submit_approval: function(e) {
    e.preventDefault();
    $(e.target).parents('form').submit();
    var $approve_case_plan_modal = $('#approve-case-plan-modal');
    $approve_case_plan_modal.foundation('reveal', 'close');
    $approve_case_plan_modal.find('form')[0].reset();
    window.disable_loading_indicator = true;
  }
});