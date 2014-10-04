var FlagRecord = Backbone.View.extend({

  el: 'body',

  events: {
    'click div.flag_records a.flag' : 'flag_records'
  },

  flag_records: function(event) {
    event.stopPropagation();
    var target = $(event.target);
    var selected_records = []
    var form_action = target.data('form_action');
    var flag_error_message = target.data('submit_error_message');
    var selected_records_error_message = target.data('selected_records_error_message');
    var flag_message = target.parents('.flag_records').find('input.flag_message').val();
    var flag_date = target.parents('.flag_records').find('input.flag_date').val();
    var search_params = this.clean_select_all_page_params();
    if (flag_message.length > 0) {
      $('input.select_record:checked').each(function(){
        selected_records.push($(this).val());
      });
      if (selected_records.length > 0) {
        $.post(form_action + "?" + _primero.object_to_params(_primero.filters),
          {
            'selected_records': selected_records,
            'flag_message': flag_message,
            'flag_date': flag_date,
            'all_records_selected': $("input#select_all_records").is(':checked')
          },
          function(response){
            if (!response.success) {
              alert(response.error_message);
            }
            if ((response.success) || (response.reload_page)) {
              if ($('input#select_all_records').is(':checked')) {
                location.reload(true);
              } else {
                window.location.search = search_params;
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
  clean_select_all_page_params: function() {
      var source = location.href,
          rtn = source.split("?")[0],
          param,
          params_arr = [],
          query = (source.indexOf("?") !== -1) ? source.split("?")[1] : "";
      if (query !== "") {
          params_arr = query.split("&");
          for (var i = params_arr.length - 1; i >= 0; i -= 1) {
              param = params_arr[i].split("=")[0];
              if (param === "select_all") {
                  params_arr.splice(i, 1);
              }
          }
          rtn = params_arr.join("&");
      } else {
        rtn = "";
      }
      return rtn;
  }
});

$(document).ready(function() {
  new FlagRecord();
});