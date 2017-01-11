_primero.Views.HiddenTextField = Backbone.View.extend({
  el: '.page_content form',
  events: {
    'click a.hidden_text_field' : 'hide_field'
  },

  hide_field: function(event) {
    event.preventDefault();
    var $action_link = $(event.target);
    var action = $action_link.attr('action');
    var $input_field = $action_link.parent().find("input[type='text']");
    var $hidden_input_field = $action_link.parent().find("input[type='hidden']");
    $.post('hide_name',
      {
        protect_action: action
      },
      function(response){
        if(response.error){
          $('<div title="PRIMERO"><p></p>' + response.text +
            '<button type="button" class="ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only" role="button" onclick="$(this).parent().parent().remove();">' +
            '<span class="ui-button-text">' + response.accept_button_text + '</span></button></div>').dialog();
        }
        else {
          if ($input_field.is(":disabled")) {
            if ($hidden_input_field.length > 0) {
              $input_field.val($hidden_input_field.val()).attr('disabled', response.disable_input_field);
              $hidden_input_field.remove();
            } else {
              $input_field.val(response.input_field_text).attr('disabled', response.disable_input_field);
            }
          } else {
            $hidden_input_field = $('<input type="hidden">').attr('name', $input_field.attr('name'));
            $hidden_input_field.val($input_field.val());
            $input_field.val(response.input_field_text).attr('disabled', response.disable_input_field).after($hidden_input_field);
          }
          $action_link.text(response.action_link_text).attr('action', response.action_link_action);
        }
      }
    );
  }
});