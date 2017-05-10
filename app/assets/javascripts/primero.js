$(document).ready(function() {
  jQuery.migrateMute = true

  new Primero();

  $(document).foundation({
    abide: {
      validators: {
        primeroDate: function(el, required, parent) {
          return _primero.abide_validator_date(el, required, parent);
        },
        primeroDateNotInFuture: function(el, required, parent) {
          return _primero.abide_validator_date_not_future(el, required, parent);
        },
        primeroPositiveNumber: function(el, required, parent) {
          return _primero.abide_validator_positive_number(el, required, parent);
        }
      }
    }
  });

  $(document).on('open.fndtn.reveal', '[data-reveal]', function () {
    $('body').css('overflow','hidden');
  });

  $(document).on('opened.fndtn.reveal', '[data-reveal]', function () {
    $(document).foundation('abide', 'reflow');
  });

  $(document).on('close.fndtn.reveal', '[data-reveal]', function () {
    $('body').css('overflow','visible');
  });

  new _primero.Router();
  Backbone.history.start({ pushState: true, hashChange: false })
});
