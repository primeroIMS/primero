_primero.Views.ToggableField = _primero.Views.Base.extend({
  el: '.page_content form',

  events: {
    'click .toggable_field_with_permissions' : 'toggle_field'
  },

  toggle_field: function(e) {
    e.preventDefault();

    var link = $(e.target);

    // TODO: Right now we are focused on a chosen field.
    // Will need to adjust selector for other fields
    link.parent().find('select')
      .attr('disabled', false)
      .trigger("chosen:updated");
  }
});