window._primero = {
  Views: {}
}

window.pagination_details = {};

window.dispatcher = _.clone(Backbone.Events)

function clearTimers() {
  window.clearInterval(window.idleTimer);
  window.clearInterval(window.countdown);
  window.clearTimeout(window.timer);
}

$(document).on('turbolinks:before-render', function() {
  if (_primero.Router) {
    Backbone.history.stop();
    dispatcher.trigger( 'CloseView' );
  }

  clearTimers()
});

$(document).on('turbolinks:before-cache', function() {
  $('.sf-menu').superfish('destroy');
  $(".chosen-select").chosen("destroy");
  $('.dataTables_length, .dataTables_paginate').remove();
  $('.mCustomScrollbar').mCustomScrollbar("destroy")

  clearTimers();
});

function primero() {
  jQuery.migrateMute = true

  var $document = $(document);
  var $body = $('body');

  $document.foundation();

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

  if (window.location.href.indexOf('login') === -1) {
    IdleSessionTimeout.start();
  }
}

document.cookie = "timezone=" + moment.tz.guess() + "; path=/;";

$(primero);