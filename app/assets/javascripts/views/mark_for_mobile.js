_primero.Views.MarkForMobile = _primero.Views.Base.extend({

  el: '#menu',

  events: {
    'click .mark_for_mobile' : 'mark_records_for_mobile'
  },

  show_error_message: function(message) {
    var $flash = $('.flash');
    $flash.remove();
    $('.page_container').prepend(JST['templates/mark_for_mobile_error']({message: message}))
    setTimeout(function(){
      $flash.remove();
    },7000);
  },

  reload_location: function() {
    location.reload(true);
  },

  mark_records_for_mobile: function(event) {
    var self = this;
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
        if (response.success) {
          self.reload_location();
        } else {
          self.show_error_message(response.message);
        }
      }
    );
  },
});