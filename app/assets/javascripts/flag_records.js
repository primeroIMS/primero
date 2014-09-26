var FlagRecord = Backbone.View.extend({

  el: 'body',

  events: {
    'click div.flag_records a.flag' : 'flag_records',
    'change input#select_all_records' : 'select_unselect_all_records',
    'change input.select_record' : 'select_unselect_record'
  },

  flag_records: function(event) {
    event.stopPropagation();
    var target = $(event.target);
    var selected_records = []
    var form_action = target.data('form_action');
    var redirect_url = target.data('request_url');
    var flag_error_message = target.data('submit_error_message');
    var selected_records_error_message = target.data('selected_records_error_message');
    var flag_message = target.parents('.flag_records').find('input.flag_message').val();
    var flag_date = target.parents('.flag_records').find('input.flag_date').val();
    if (flag_message.length > 0) {
      $('input.select_record:checked').each(function(){
        selected_records.push($(this).val());
      });
      if (selected_records.length > 0) {
        $.post(form_action,
          {
            'selected_records': selected_records,
            'redirect_url': redirect_url,
            'flag_message': flag_message,
            'flag_date': flag_date,
          }, 
          function(response){
            if(response.success) {
              location.reload(true);
            } else {
              alert(response.error_message);
              if(response.reload_page) {
                location.reload(true);
              }
            }
          }
        );
      } else {
        alert(selected_records_error_message);
      }
    } else {
      alert(flag_error_message);
    }
  },

  select_unselect_all_records: function(event) {
    var select_all_input = $(event.target);
    if (select_all_input.is(':checked')) {
      $('input.select_record').attr('checked', true);
    } else {
      $('input.select_record').attr('checked', false);
    }
  },

  select_unselect_record: function(event) {
    var all_records_selected = true;
    $('input.select_record').each(function() {
      if (!$(this).is(":checked")) {
        all_records_selected = false;
      }
    });
    $("input#select_all_records").attr('checked', all_records_selected);
  }
});

$(document).ready(function() {
  new FlagRecord();
});