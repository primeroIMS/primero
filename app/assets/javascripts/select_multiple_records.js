var SelectMultipleRecords = Backbone.View.extend({

  el: 'body',

  events: {
    'change input#select_all_records' : 'select_unselect_all_records',
    'change input.select_record' : 'select_unselect_record'
  },

  select_unselect_all_records: function(event) {
    var select_all_input = $(event.target);
    if (select_all_input.is(':checked')) {
      $('input.select_record').attr('checked', true);
    } else {
      $('input.select_record').attr('checked', false);
    }
  },

  select_unselect_record: function(event) {
    var all_records_selected = true;
    $('input.select_record').each(function() {
      if (!$(this).is(":checked")) {
        all_records_selected = false;
      }
    });
    $("input#select_all_records").attr('checked', all_records_selected);
  }
});

$(document).ready(function() {
  new SelectMultipleRecords();
});