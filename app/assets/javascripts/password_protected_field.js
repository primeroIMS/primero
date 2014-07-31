var PasswordProtectedField = Backbone.View.extend({
  el: '.page_content form',
  events: {
    'click a.password_protected_field' : 'password_protect_field'
  },

  password_protect_field: function(event) {
    event.preventDefault();
    var action_link = $(event.target);
    var action = action_link.attr('action');
    var input_field = action_link.parent().find("input[type='text']");
    var password_confirmation_popup = $('div#password_confirmation_popup');
    var password_confirmation_message = $('div#password_confirmation_message');
    password_confirmation_popup.dialog();
    password_confirmation_popup.parent().show();
    password_confirmation_popup.find('button[type="button"]').one('click', function(){
      $.post('password_protect_name',
        {
          protect_action: action,
          password: password_confirmation_popup.find('input[id="confirm_password"]').val()
        },
        function(response){
          if(response.error){
             password_confirmation_message.find('p').text(response.text);
             password_confirmation_message.dialog();
             password_confirmation_message.parent().show();
          }
          else {
            input_field.val(response.input_field_text).attr('disabled', response.disable_input_field);
            action_link.text(response.action_link_text).attr('action', response.action_link_action);
          }
        }
      );
      password_confirmation_popup.parent().hide();
    });
  }
});

$(document).ready(function(){
  new PasswordProtectedField();
})