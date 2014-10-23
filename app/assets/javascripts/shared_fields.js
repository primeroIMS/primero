var SharedFields = Backbone.View.extend({
	el: '.page_content form',

	events: {
		'change input': 'find_shared_fields',
		'change select': 'find_shared_fields',
		'change textarea': 'find_shared_fields'
	},

	find_shared_fields: function(event) {
		var target = $(event.target),
				type = $(event.target)[0].nodeName.toLowerCase(),
				shared_field = $(this.el).find(type + '[name="' + target.attr('name') + '"]:hidden')
																 .not(event.target);
		var subform = target.parents('div.subforms');
		if (subform.length > 0) {
			var subform_index = target.parents('div.subform').data('subform_index');
			var input_name = target.attr('name').split('[' + subform_index + ']').pop();
			if (subform.data('is_shared_subform')) {
				shared_field = shared_field.add($('div#' + subform.data('shared_subform') + ' div[data-subform_index="' + subform_index + '"]')
					.find(type + '[name$="' + input_name + '"]:hidden'));
			} else {
				$('div[data-shared_subform="' + subform.attr('id') + '"] div[data-subform_index="' + subform_index + '"]').each(function(){
					shared_field = shared_field.add($(this).find(type + '[name$="' + input_name + '"]:hidden'));
				})
			}
		}

		if (target.is(':checkbox')) {
			var target_val = target.attr('value');
			shared_field.each(function(id, input) {
				if ($(input).val() == target_val) {
					$(input).prop('checked', target.is(':checked'))
				}
			});
		} else {
			shared_field.each(function(){
				$(this).val(target.val());
				_primero.update_autosum_field($(this));
				if ($(this).hasClass("chosen-select")) {
				  $(this).trigger("chosen:updated");
				}
			});
		}
	}
});

$(document).ready(function() {
	new SharedFields();
});
