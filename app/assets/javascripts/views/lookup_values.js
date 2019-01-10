_primero.Views.LookupValueView = _primero.Views.Base.extend({
  el: '.side-tab-content',

  events: {
    'click .lookup_value_remove': 'removeLookup',
    'click .lookup_value_add': 'addLookup',
  },

  initialize: function() {
  },

  addLookup: function(event) {
    event.preventDefault();
    var $this = $(event.currentTarget);
    var $value_list = $(this.el).find('#lookup_values');
    var current_locale_selection = $('#locale').val();
    var newLookup = $(JST['templates/lookups_row']({
      locale: $this.data('given_locale'),
      id: '',
      display_text: '',
      editing: $this.hasClass('edit_lookup'),
      locale_options: $this.data('lang'),
      remove_text: $this.data('remove'),
      help_text: $this.data('help_text')
    }));
    newLookup.find('a.field_option_remove_button').click(self.removeLookup);
    $value_list.append(newLookup);
    if (!_.isUndefined(current_locale_selection) &&
        current_locale_selection !== '') {
      newLookup.find('.' + current_locale_selection).show();
    }
    $("#locale").trigger('change')
  },

  removeLookup: function(event) {
    event.preventDefault();
    var $value_list = $(this.el).find('#lookup_values');
    var list_cnt = $value_list.children().length;
    var target = event.currentTarget || event.srcElement;
    var $target_value = $(target).parents('.lookup_value');

    //Do not allow removal of last two inputs
    $target_value.remove();
  },

});
