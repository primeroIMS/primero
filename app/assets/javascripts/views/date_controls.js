_primero.Views.DateControl = Backbone.View.extend({
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
	  $.datepicker.initialize_datepicker = function(el) {
	    el.datepicker({
	      dateFormat: $.datepicker.defaultDateFormat,
	      changeMonth: true,
	      changeYear: true,
	      constrainInput: true,
	      yearRange: "1900:c+10"
	    }).click(function(e) {
        $('#ui-datepicker-div').click(function(e){
          e.stopPropagation();
        });
      });
	  };
	  $.datepicker.defaultDateFormat = 'dd-M-yy';
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
		var $control = $(event.target);
		$.datepicker.initialize_datepicker($control);
	},

	format_date_input: function(event) {
		var $control = $(event.target);

		//Get the expected valid format to send to the server.
		var date_format = $control.datepicker("option", "dateFormat");

		//There is no public interface to get the settings of the datepicker object.
		//There is no public interface to get the current instance of the date picker
		//datepicker is a singleton object. $.datepicker._curInst is the current instance
		//should be the same as the target.
		var settings = $.datepicker._getFormatConfig($.datepicker._curInst);

		//There is no way to know that the current value of the datepicker is a valid value
		//we need to parse again to know that in order to format to the expected format
		//in the server side validation.
		var parsed_date = $.datepicker.parseDate(date_format, $control.val(), settings);
		if (parsed_date != undefined && parsed_date != null) {
		  //If passed the parse, fix the format to the expected format
		  //to send to the server.
		  $control.val($.datepicker.formatDate(date_format, parsed_date));
		}
	}
});