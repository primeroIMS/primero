$(document).ready(function() {
  jQuery.migrateMute = true

  new Primero();

  $(document).on('open.fndtn.reveal', '[data-reveal]', function () {
    $('body').css('overflow','hidden');
  });

  $(document).on('close.fndtn.reveal', '[data-reveal]', function () {
    $('body').css('overflow','visible');
  });

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

  // Has bad side effects if in Backbone view
  $('form.default-form').on('submit.fndtn.abide', function(e) {
    var abide = Foundation.libs.abide;
    return abide.validate(abide.S(this).find('input, textarea, select').get(), e, false);
  })

  new _primero.Router();
  Backbone.history.start({ pushState: true, hashChange: false })
});
