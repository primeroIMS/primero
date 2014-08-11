var ViolationListReload = Backbone.View.extend({
  el: '.side-tab-content',

  events: {
    'click .incident_reload_violations': 'reload'
  },

  initialize: function() {
  },

  //Refresh Stuff....
  reload: function(event) {
    // temp... for testing
    // TODO - get real violations list
    var violation_list = ['Violation1', 'Violation2', 'Violation3'];

    var context = this.el;
    $(context).find("select[id$='_violations_']").each(function(x, violationEl){
      //Clear out existing options
      violationEl.empty();

      //Add new options
      _.each(violation_list, function(i){
        var newOption = $('<option value="' + i + '">' + i + '</option>');
        violationEl.append(newOption);
      });
      violationEl.trigger("chosen:updated");
    });
  },
});

$(document).ready(function() {
  var violationListReload = new ViolationListReload();
});
