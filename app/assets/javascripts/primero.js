$(document).ready(function() {
  new Primero();

  $(document).on('open.fndtn.reveal', '[data-reveal]', function () {
    $('body').css('overflow','hidden');
  });

  $(document).on('close.fndtn.reveal', '[data-reveal]', function () {
    $('body').css('overflow','visible');
  });

  new _primero.Router();
  Backbone.history.start({ pushState: true, hashChange: false })
});
