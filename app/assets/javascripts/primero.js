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

// TODO: Add back in if they want the old loading indicator
// $(document).on('turbolinks:visit', function() {
//   _primero.loading_screen_indicator('show');
// });

function primero() {
  jQuery.migrateMute = true

  var $document = $(document);
  var $body = $('body');

  $document.on('open.fndtn.reveal', '[data-reveal]', function () {
    $body.css('overflow','hidden');
  });

  $document.on('close.fndtn.reveal', '[data-reveal]', function () {
    $body.css('overflow','visible');
  });

  $document.foundation();

  if ($('html').attr('dir') === 'rtl') {
    $('.chosen-select').addClass('chosen-rtl');
  }

  new Primero();
  // $document.foundation({
  //   abide : {
  //     validators: {
  //       primeroDate: function(el, required, parent) {
  //         return _primero.abide_validator_date(el, required, parent);
  //       },
  //       primeroDateNotInFuture: function(el, required, parent) {
  //         return _primero.abide_validator_date_not_future(el, required, parent);
  //       },
  //       primeroPositiveNumber: function(el, required, parent) {
  //         return _primero.abide_validator_positive_number(el, required, parent);
  //       }
  //     }
  //   }
  // });

  new _primero.Router();
  Backbone.history.start({ pushState: true, hashChange: false })
  // _primero.loading_screen_indicator('hide');
}

$(primero);