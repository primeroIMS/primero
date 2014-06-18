window._primero = {};

$(document).ready(function(){
  $('fieldset#tab_basic_identity input#child_date_of_birth').change(function(){
    try{
      dateFormat = $(this).datepicker("option", "dateFormat");
      date_of_birth = $.datepicker.parseDate(dateFormat, $(this).val());
      age = (new Date).getFullYear() - date_of_birth.getFullYear();
    } catch (e) {
      age = NaN;
    }
    if (isNaN(age) || age < 0)
      $('fieldset#tab_basic_identity input#child_age').val('');
    else
      $('fieldset#tab_basic_identity input#child_age').val(age);
  });

  $('fieldset#tab_basic_identity input#child_age').change(function(){
    age = $(this).val();
    if (isNaN(age))
      $('fieldset#tab_basic_identity input#child_date_of_birth').val('');
    else {
      //Call the focus() method to initialize the input as a datepicker and get its dateFormat.
      $('fieldset#tab_basic_identity input#child_date_of_birth').focus();
      dateFormat = $("#child_date_of_birth").datepicker("option", "dateFormat");
      year_of_birth = (new Date).getFullYear() - age;
      date_of_birth = $.datepicker.formatDate(dateFormat, new Date('01/01/' + year_of_birth));
      $('fieldset#tab_basic_identity input#child_date_of_birth').val(date_of_birth);
    }
  });
});

_primero.model_object = 'child'