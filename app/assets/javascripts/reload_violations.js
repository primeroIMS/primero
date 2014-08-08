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
      
      //Find all violation select boxes and for each, refresh the options list
      var fooId = 'incident_perpetrator_subform_section_0_perpetrator_violations_';
      var fooEl = this.$el.find("#" + fooId);
      fooEl.empty();

       _.each(violation_list, function(i){
         var newOption = $('<option value="' + i + '">' + i + '</option>');
         fooEl.append(newOption);
       });
       fooEl.trigger("chosen:updated");
  },
});

$(document).ready(function() {
  var violationListReload = new ViolationListReload();
});
