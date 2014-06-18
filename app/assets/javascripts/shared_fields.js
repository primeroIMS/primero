var SharedFields = Backbone.View.extend({
	el: '.page_content',

	events: {
		'change input': 'find_shared_fields',
		'change select': 'find_shared_fields'
	},

	find_shared_fields: function(event) {
		var target = $(event.target),
				type = $(event.target)[0].nodeName.toLowerCase(),
				shared_field = $(this.el).find(type + '[name="' + target.attr('name') + '"]:hidden')
																 .not(event.target);

		if (target.is(':checkbox')) {
			var target_val = target.attr('value');
			shared_field.each(function(id, input) {
				if ($(input).val() == target_val) {
					$(input).prop('checked', target.is(':checked'))
				}
			});
		} else {
			shared_field.val(target.val())
		}
	}
});

$(document).ready(function() {
	new SharedFields();
});
