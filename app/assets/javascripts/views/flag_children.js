_primero.Views.FlagChild = Backbone.View.extend({

  el: 'body',

  events: {
    'click .dropdown_btn': 'show_hide_dropdown',
    'click .dropdown': 'stop_propagation',
    'click .collapse_expand_flag': 'collapse_expand_flag',
    'click .view_history_flags': 'view_history_flags'
  },

  stop_propagation: function(event) {
    event.stopPropagation();
  },

  show_hide_dropdown: function(event) {
    var $dropdown = $(event.target).parents('.dropdown_btn').find('.dropdown');

    $dropdown.toggleClass('hide').show();
    this.generate_form($dropdown);

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
      submit_error_message: dropdown.data('submit_error_message'),
      unflag_date: dropdown.data('message_unflag_date'),
      unflag_by: dropdown.data('message_unflag_by'),
      unflagged_label: dropdown.data('message_unflagged_label')
    };
    dropdown.find('.add_flag_form').html(JST['templates/flag_record_form'](this.data));
  },

  collapse_expand_flag: function(event) {
    var $target = $(event.target),
      self = this;
    $('.expanded_flag').not($target).toggleClass("expanded_flag").toggleClass("collapsed_flag");
    $target.toggleClass("expanded_flag");
    $target.toggleClass("collapsed_flag");
    $('.remove_flag_record_container').slideToggle().remove();
    if ($target.hasClass('expanded_flag')) {
      var flag_removed = $target.data('removed');
      if (flag_removed === true) {
        self.data.unflagged_by = $target.data('unflagged_by');
        self.data.remove_message = $target.data('remove_message');
        self.data.unflagged_date = $target.data('unflagged_date');
        $target.parent('li').append(JST['templates/remove_flag_record_show'](self.data));
      } else {
        self.data.flag_message = $target.data('message');
        self.data.flag_index = $target.data('message_index');
        $target.parent('li').append(JST['templates/remove_flag_record_form'](self.data));
      }
    }
    $('.collapsed_flag').text('+');
    $('.expanded_flag').text('-');
  },

  view_history_flags: function(event) {
    $(".history_flags, .history_flags_label").toggle();
    event.stopPropagation();
  }

});
