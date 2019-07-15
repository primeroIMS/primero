_primero.Views.Connectivity = _primero.Views.Base.extend({
  el: 'body',

  initialize: function() {
    if (_primero.check_connectivity == "on") {
      _.bindAll(this, 'update_status');

      this.update_status();

      $(window).on('offline', this.update_status);
      $(window).on('online', this.update_status);
    }
  },

  update_status: function() {
    var self = this;
    var selectors = [
      '.button',
      'ul#menu'
    ];
    var container_selectors = [
      '.index_controls_container',
      '.record_controls_container'
    ];
    var container_elements = $(container_selectors.join(', '));
    var elements = $(selectors.join(', '));

    if (navigator.onLine) {
      elements.removeClass('disabled');
      $('#connectivity-message').fadeOut().remove();
    } else {
      elements.addClass('disabled');
      container_elements.prepend('<div id="connectivity-message">' + I18n.t('offline')  + '</div>');
    }
  }
});
