var DateControl = Backbone.View.extend({
	el: 'body',

	allowed_formats: [
    "dd-mm-yy", 
    "dd/mm/yy", 
    "dd mm yy",
    "dd-M-yy",
    "dd/M/yy"
	],

	events: {
		'focus .form_date_field': 'trigger_date_control',
		'change .form_date_field': 'format_date_input'
	},

	initialize: function() {
		this.setup_date_parser();
	},

	setup_date_parser: function() {
		$.datepicker.inputFormats = this.allowed_formats;
		$.datepicker.originalParseDate = $.datepicker.parseDate;
		$.datepicker.parseDate = function (format, value, settings) {
	    var date;

	    function testParse(format, value, settings) {
        if ( ! date ) {
          try {
            date = $.datepicker.originalParseDate(format, value, settings);
          } catch (Error) {
          }
        }
	    }

	    testParse(format, value, settings);
	    for(var n = 0, stop = $.datepicker.inputFormats ? $.datepicker.inputFormats.length : 0; n < stop; n++){
	      testParse($.datepicker.inputFormats[n], value, settings);
	    };
	    return date;
		};
	},

	trigger_date_control: function(event) {
		var control = $(event.target);
		control.datepicker({ 
      dateFormat: 'dd-M-yy',
      changeMonth: true,
      changeYear: true,
      constrainInput: true
    });
	},

	format_date_input: function(event) {
		var control = $(event.target),
				selected_date = control.datepicker('getDate');
		control.val($.datepicker.formatDate('dd-M-yy', selected_date));
	}
});

$(document).ready(function() {
	new DateControl();
});