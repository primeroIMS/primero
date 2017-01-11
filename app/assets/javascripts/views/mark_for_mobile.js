_primero.Views.MarkForMobile = Backbone.View.extend({

  el: '#menu',

  events: {
    'click a.mark_for_mobile' : 'mark_records_for_mobile'
  },

  mark_records_for_mobile: function(event) {
    var selected_recs = _primero.indexTable.get_selected_records(),
        mobile_button = $(event.target),
        request_url = mobile_button.data('mark_mobile_url'),
        mobile_value = mobile_button.data('mobile_value'),
        id = mobile_button.data('id');

    $.post(request_url,
      {
        'selected_records': selected_recs.join(","),
        'mobile_value': mobile_value,
        'id': id
      },
      function(response){
        var $flash = $('.flash');
        if (response.success) {
          location.reload(true);
        } else {
          $flash.remove();
          var message = '<div class="flash row"> <p class="error large-12">' + response.message + '</p></div>';
          $('.page_container').prepend(message);
          setTimeout(function(){
            $flash.remove();
          },7000);
        }
      }
    );
  },
});