var FieldCalculations = Backbone.View.extend({
	el: '.page_content form',

	events: {
		'change input[id$="total_girls"]': 'sum_victim_survivor_fields',
		'change input[id$="total_boys"]': 'sum_victim_survivor_fields',
		'change input[id$="total_unknown"]': 'sum_victim_survivor_fields'
	},

	sum_victim_survivor_fields: function(event) {
		var girls = parseInt($('input[id$="total_girls"]').val()) || 0,
				boys = parseInt($('input[id$="total_boys"]').val()) || 0,
				unknown = parseInt($('input[id$="total_unknown"]').val()) || 0,
				total_field = $('input[id$="total_total"]'),
				sum = girls + boys + unknown;

				console.log('here')

		total_field.val(sum);
	}

});

$(document).ready(function() {
	new FieldCalculations();
});