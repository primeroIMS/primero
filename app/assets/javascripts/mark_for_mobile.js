var MarkForMobile = Backbone.View.extend({

  el: 'body',

  events: {
    'click a.mark_for_mobile' : 'mark_records_for_mobile'
  },

  mark_records_for_mobile: function(event) {
    //event.stopPropagation();

    var selected_recs = _primero.indexTable.get_selected_records(),
        mobile_button = $(event.target),
        request_url = mobile_button.data('mark_mobile_url'),
        mobile_value = mobile_button.data('mobile_value');

    //var apply_to_all = false;

    //var selected_records = _primero.indexTable.get_selected_records();
    //if (selected_recs.length == 0) {
      //apply_to_all = true;
    //}

    //_primero.loading_screen_indicator('show');

    $.post(request_url,
      {
        'selected_records': selected_recs.join(","),
        'mobile_value': mobile_value
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
  },
  /*
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
  */
});

$(document).ready(function() {
  new MarkForMobile();
});
