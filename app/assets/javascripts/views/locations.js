_primero.Views.Locations = _primero.Views.Base.extend({
  el: 'form.location-new-edit',

  events: {
    'change select#location_parent_id' : 'toggle_admin_level'
  },

  toggle_admin_level: function(e) {
    var parent_id = $(e.target).val(),
        admin_level_select = $('select#location_admin_level');

    if(parent_id == null || parent_id == undefined || parent_id.trim() == ""){
      admin_level_select.prop('disabled', false);
    } else {
      admin_level_select.prop('disabled', true);
    }
  }

});