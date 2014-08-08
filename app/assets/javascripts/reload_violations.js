var ViolationListReload = Backbone.View.extend({
  el: '.side-tab-content',

  events: {
    'click .incident_reload_violations': 'reload'
  }, 

  initialize: function() {
  },

  //Refresh Stuff....
  reload: function(event) {
  },
});

$(document).ready(function() {
  var violationListReload = new ViolationListReload();
});
