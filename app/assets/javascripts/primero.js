window._primero = {
  Views: {}
}

window.pagination_details = {};

window.dispatcher = _.clone(Backbone.Events)

$(document).on('turbolinks:before-render', function() {
  if (_primero.Router) {
    Backbone.history.stop();
    dispatcher.trigger( 'CloseView' );
  }
});

$(document).on('turbolinks:before-cache', function() {
  $('.sf-menu').superfish('destroy');
  $('.dataTables_length, .dataTables_paginate').remove();
  $('.mCustomScrollbar').mCustomScrollbar("destroy")
});

function primero() {
  jQuery.migrateMute = true

  var $document = $(document);
  var $body = $('body');

  $document.on('open.zf.reveal', '[data-reveal]', function () {
    $body.css('overflow','hidden');
  });

  $document.on('closed.zf.reveal', '[data-reveal]', function () {
    $body.css('overflow','visible');
  });

  $document.foundation();

  if ($('html').attr('dir') === 'rtl') {
    $('.chosen-select').addClass('chosen-rtl');
  }

  new Primero();

  Foundation.Abide.defaults.validators['primeroDate'] = function(el, required, parent) {
    return _primero.abide_validator_date(el, required, parent);
  }

  Foundation.Abide.defaults.validators['primeroDateNotInFuture'] = function(el, required, parent) {
    return _primero.abide_validator_date_not_future(el, required, parent);
  }

  Foundation.Abide.defaults.validators['primeroPositiveNumber'] = function(el, required, parent) {
    return _primero.abide_validator_positive_number(el, required, parent);
  }

  new _primero.Router();

  Backbone.history.start({ pushState: true, hashChange: false })
}

$(primero);