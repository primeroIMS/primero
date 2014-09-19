var FlagChild = Backbone.View.extend({

	el: 'body',

	events: {
		'click .dropdown_btn': 'show_hide_dropdown',
		'click .dropdown': 'stop_propagation',
		'click i.remove_flag': 'remove_flag'
	},

	stop_propagation: function(event) {
		event.stopPropagation();
	},

	show_hide_dropdown: function(event) {
		var dropdown = $(event.target).parents('.dropdown_btn').find('.dropdown');

    dropdown.toggleClass('hide').show();
    this.generate_form(dropdown);

    event.stopPropagation();
	},

	generate_form: function(dropdown) {
		this.data = {
      model: dropdown.data('model'),
      form_action: dropdown.data('form_action'),
      form_unflag_action: dropdown.data('form_unflag_action'),
      form_id: dropdown.data('form_id'),
      authenticity_token:  dropdown.data('authenticity_token'),
      message_id: dropdown.data('message_id'),
      message: dropdown.data('message'),
      unflag_message: dropdown.data('message_unflag'),
      message_date: dropdown.data('message_date'),
      message_date_id: dropdown.data('message_date_id'),
      property: dropdown.data('property'),
      redirect_url: dropdown.data('request_url'),
      submit_label: dropdown.data('submit_label'),
      unflag_submit_label: dropdown.data('submit_unflag_label'),
      submit_error_message: dropdown.data('submit_error_message')
		}
		dropdown.find('.add_flag_form').html(HandlebarsTemplates.flag_record_form(this.data));
	},

	remove_flag: function(event) {
		$('.remove_flag_record_container').slideToggle().remove();

		this.data.flag_message = $(event.target).data('message');
		this.data.flag_index = $(event.target).data('message_index');

		$(event.target).parent('li').append(HandlebarsTemplates.remove_flag_record_form(this.data));
	}
});

$(document).ready(function() {
	new FlagChild();
});