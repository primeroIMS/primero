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

  $document.foundation();

  if ($('html').attr('dir') === 'rtl') {
    $('.chosen-select, .chosen-select-or-new, .report_filter_attribute, #report_aggregate_by, #report_module_ids, #report_disaggregate_by')
      .addClass('chosen-rtl');
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

  // Has bad side effects if in Backbone view
  $('form.default-form').on('submit.fndtn.abide', function(e) {
    var abide = Foundation.libs.abide;
    return abide.validate(abide.S(this).find('input, textarea, select').get(), e, false);
  })

  new _primero.Router();

  Backbone.history.start({ pushState: true, hashChange: false })
}

$(primero);