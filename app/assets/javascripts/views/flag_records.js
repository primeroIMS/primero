_primero.Views.FlagRecord = _primero.Views.Base.extend({

  /**
  TODO: This is code for batch flagging. It should really be consolidated with the code for individual flags
        in flag_children.js.
  **/

  el: 'body',

  events: {
    'click .flag_records a.flag' : 'flag_records'
  },

  flag_records: function(event) {
    event.stopPropagation();
    var $target = $(event.target);
    var form_action = $target.data('form_action');
    var flag_error_message = $target.data('submit_error_message');
    var flag_message = $target.parents('.flag_records').find('input.flag_message').val();
    var flag_date = $target.parents('.flag_records').find('input.flag_date').val();
    var flag_date_valid = !($target.parents('.flag_records').find('input.flag_date')[0].hasAttribute('data-invalid'));
    var search_params = this.clean_select_all_page_params();
    var apply_to_all = false;
    if (flag_message.length > 0 && flag_date_valid) {
      var selected_records = _primero.indexTable.get_selected_records();
      if (selected_records.length == 0) {
        apply_to_all = true;
      }

      _primero.loading_screen_indicator('show');

      $.post(form_action + "?" + _primero.object_to_params(_primero.filters),
        {
          'selected_records': selected_records,
          'flag_message': flag_message,
          'flag_date': flag_date,
          'apply_to_all': apply_to_all
        },
        function(response){
          if (!response.success) {
            alert(response.error_message);
          }
          if ((response.success) || (response.reload_page)) {
            if (apply_to_all) {
              location.reload(true);
            } else {
              window.location.search = search_params;
            }
          }
        }
      );
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