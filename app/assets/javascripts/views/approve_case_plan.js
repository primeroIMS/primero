_primero.Views.ApproveCasePlan = Backbone.View.extend({

  el: '#menu',

  events: {
    'click a.approve_case_plan' : 'approve_case_plan',
    'click div#approve-case-plan-modal input[type="submit"]' : 'submit_approval'
  },


  approve_case_plan: function(event) {

  },

  //approve_case_plan: function(event) {
  //  var approval_button = $(event.target),
  //      request_url = approval_button.data('approve_case_plan_url'),
  //      id = approval_button.data('id');
  //
  //  $.post(request_url,
  //    {
  //      'id': id
  //    },
  //    function(response){
  //      if (response.success) {
  //        location.reload(true);
  //      } else {
  //        $('.flash').remove();
  //        var message = '<div class="flash row"> <p class="error large-12">' + response.message + '</p></div>';
  //        $('.page_container').prepend(message);
  //        setTimeout(function(){
  //          $('.flash').remove();
  //        },7000);
  //      }
  //    }
  //  );
  //},

  submit_approval: function(e) {
    e.preventDefault();
    //var password = $('div#referral-modal input#password').val(),
    //    local_user = $('div#referral-modal select#existing_user').val(),
    //    remote_user = $('div#referral-modal input#other_user').val(),
    //    is_remote = $('div#referral-modal input#is_remote').prop('checked'),
    //    localUserErrorDiv = $("div#referral-modal .local_user_flash"),
    //    remoteUserErrorDiv = $("div#referral-modal .remote_user_flash"),
    //    passwordErrorDiv = $("div#referral-modal .password_flash"),
    //    is_valid = true;
    var is_valid = true;



    if(is_valid){
      //localUserErrorDiv.hide();
      //remoteUserErrorDiv.hide();
      //passwordErrorDiv.hide();
      $(e.target).parents('form').submit();
      $('#approve-case-plan-modal').foundation('reveal', 'close');
      $('#approve-case-plan-modal form')[0].reset();
      window.disable_loading_indicator = true;
    } else {
      return false;
    }
  }
});