var ageBirthDate = Backbone.View.extend({
  el: '.page_content form',

  events: function() {
    var _events = {},
    dob_inputs = 'input[id^="' + _primero.model_object + '_date_of_birth"][id$="' + _primero.model_object + '_date_of_birth"]',
    age_inputs = 'input[id^="' + _primero.model_object + '_age"][id$="' + _primero.model_object + '_age"]';
    _events["change " + dob_inputs] = "calculate_dob_fields";
    _events["change " + age_inputs] = "calculate_age_fields";
    return _events;
  },

  calculate_dob_fields: function(event) {
    event.preventDefault();
    try{
      // Get the date format from the datepicker and use it to parse the value to a valid date.
      var dateFormat = $(event.target).datepicker("option", "dateFormat"),
          date_of_birth = $.datepicker.parseDate(dateFormat, $(event.target).val()),
          age = (new Date).getFullYear() - date_of_birth.getFullYear();
    } catch (e) {
      age = NaN;
    }
    // Set the new value to all occurrences of the 'child_date_of_birth' field.
    $('input[id^="' + _primero.model_object + '_date_of_birth"][id$="' + _primero.model_object + '_date_of_birth"]').val($(event.target).val());
    // Set the calculated value to all occurrences of the 'child_age' field. In case of an error parsing the date or an age under 0, set an empty value.
    if (isNaN(age) || age < 0) {
      $('input[id^="' + _primero.model_object + '_age"][id$="' + _primero.model_object + '_age"]').val('');
    }
    else {
      $('input[id^="' + _primero.model_object + '_age"][id$="' + _primero.model_object + '_age"]').val(age);
    }
  },

  calculate_age_fields: function(event) {
    event.preventDefault();
    var age = $(event.target).val();
    // Set the new value to all occurrences of the 'child_age' field.
    $('input[id^="' + _primero.model_object + '_age"][id$="' + _primero.model_object + '_age"]').val($(event.target).val());
    // If the value of the field is not a number set an empty value to all 'child_date_of_birth' fields.
    if (isNaN(age)) {
      $('input[id^="' + _primero.model_object + '_date_of_birth"][id$="' + _primero.model_object + '_date_of_birth"]').val('');
    }
    else {
      //Call the focus() method to initialize the inputs as datepicker and get its dateFormat.
      if ($('input[id^="' + _primero.model_object + '_date_of_birth"][id$="' + _primero.model_object + '_date_of_birth"]').attr('class').indexOf('hasDatepicker') == -1)
      {
        $('input[id^="' + _primero.model_object + '_date_of_birth"][id$="' + _primero.model_object + '_date_of_birth"]').focus();
      }
      // Get the date format from one of the datepickers and use it to parse the value to a valid date.
      var dateFormat = $('#' + _primero.model_object + '_date_of_birth').datepicker("option", "dateFormat"),
          year_of_birth = (new Date).getFullYear() - age,
          date_of_birth = $.datepicker.formatDate(dateFormat, $.datepicker.parseDate('dd-M-yy', '01-Jan-' + year_of_birth));
      // Set the new value to all occurrences of the 'child_date_of_birth' field.
      $('input[id^="' + _primero.model_object + '_date_of_birth"][id$="' + _primero.model_object + '_date_of_birth"]').val(date_of_birth);
    }
  }
})

$(document).ready(function(){
  new ageBirthDate()
});