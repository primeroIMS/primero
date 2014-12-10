var ReportForm = Backbone.View.extend({

  el: '.reports_form',

  initialize: function() {
    this.init_multi_select();

  },

  init_multi_select: function() {
    _primero.chosen('.reports_form select[multiple]');
  }

});

$(document).ready(function() {
  new ReportForm();
});