var SelectMultipleRecords = Backbone.View.extend({

  el: 'body',

  events: {
    'change input#select_all_records' : 'select_unselect_all_records',
    'change input.select_record' : 'select_unselect_record'
  },

  initialize: function() {
    var select_all_records = (window.location.search.indexOf('select_all=true') > -1);
    $('input#select_all_records').attr('checked', select_all_records);
    $('input.select_record').attr('checked', select_all_records);
  },

  select_unselect_all_records: function(event) {
    var select_all_input = $(event.target);
    $('input.select_record').attr('checked', select_all_input.is(':checked'));
  },

  select_unselect_record: function(event) {
    var all_records_selected = true;
    $('input.select_record').each(function() {
      if (!$(this).is(":checked")) {
        all_records_selected = false;
      }
    });
    if(!all_records_selected) {
      $("input#select_all_records").attr('checked', false);
    }
  }
});

$(document).ready(function() {
  new SelectMultipleRecords();
});