//Hook up the corresponding event to auto calculate the age and date of birth.
//For example if there a field named child_age and there is the corresponding child_date_of_birth,
//they will update each other. Field that end on _age and _date_of_birth will be hook up the events.
var AutoCalculateAgeDOB = Backbone.View.extend({
  el: '.page_content form',

  events: {
    'change input[id$="_date_of_birth"]': 'update_age',
    'change input[id$="_age"]': 'update_date'
  },

  initialize: function() {
    var context = this.el;
    //Find every date_of_birth field in order to update the age that there is a change to be wrong
    //according the current year.
    $(context).find("input[id$='_date_of_birth']").each(function(x, dateOfBirthEl){
      var dateOfBirthName = $(dateOfBirthEl).attr("name");
      var dateOfBirthValue = $(dateOfBirthEl).val();
      if (dateOfBirthValue != "") {
        var ageName = dateOfBirthName.replace(/date_of_birth\]$/, "age]");
        $(context).find("input[name='" + ageName + "']").each(function(x, ageEl){
          try {
            var dateOfBirthDate = $.datepicker.parseDate($.datepicker.defaultDateFormat, dateOfBirthValue);
            var age = (new Date).getFullYear() - dateOfBirthDate.getFullYear();
            if (age >= 0) {
              $(ageEl).val(age);
            }
          } catch (e) {
            console.error("Has ocurred an error during re-calculate of age. " + e);
          }
        });
      }
    });
  },

  //This method will be called when the age field was changed.
  update_date: function(event) {
    event.preventDefault();
    var ageField = $(event.target);
    //Find the corresponding birth date field related to the age field.
    var dateOfBirthName = ageField[0].getAttribute("name").replace(/age\]$/, "date_of_birth]")
    var dateOfBirthField = $(this.el).find("input[name='" + dateOfBirthName + "']");

    if (dateOfBirthField.length > 0) {
      if (isNaN(ageField.val()) || ageField.val() < 0) {
        dateOfBirthField.val("");
      } else {
        if (!dateOfBirthField.hasClass("hasDatepicker")) {
          $.datepicker.initialize_datepicker(dateOfBirthField);
        }
        var dateFormat = dateOfBirthField.datepicker("option", "dateFormat");
        var year_of_birth = (new Date).getFullYear() - ageField.val();
        var date_of_birth = $.datepicker.formatDate(dateFormat, $.datepicker.parseDate($.datepicker.defaultDateFormat, '01-Jan-' + year_of_birth));
        dateOfBirthField.val(date_of_birth);
      }
    }
  },

  //This method will be called when the birth of date was changed.
  update_age: function(event) {
    event.preventDefault();
    var dateOfBirthField = $(event.target);
    //Find the corresponding age field related to the birth date field changed.
    var ageName = dateOfBirthField[0].getAttribute("name").replace(/date_of_birth\]$/, "age]")
    var ageField = $(this.el).find("input[name='" + ageName + "']");

    if (ageField.length > 0) {
      try {
          var dateFormat = dateOfBirthField.datepicker("option", "dateFormat");
          var date_of_birth = $.datepicker.parseDate(dateFormat, dateOfBirthField.val());
          var age = (new Date).getFullYear() - date_of_birth.getFullYear();
          if (age >= 0) {
            ageField.val(age);
          } else {
            ageField.val("");
          }
      } catch (e) {
        ageField.val("");
        console.error("Has ocurred an error during auto calculate of age. " + e);
      }
    }
  }
});

$(document).ready(function(){
  new AutoCalculateAgeDOB();
});
