var ViolationListReload = Backbone.View.extend({
  el: '.side-tab-content',

  events: {
    'click .incident_reload_violations': 'reload'
  },

  initialize: function() {
  },

  //Refresh Stuff....
  reload: function(event) {
    var violation_list = [];
    var count = 0;

    var context = this.el;

    // Build new violations list
    $(context).find("fieldset[id$='_violation_wrapper']").each(function(x, violationListEl){
      $(violationListEl).find(".subforms").children('div').each(function(x, violationEl){
        if ($(violationEl).children().length > 0) {

          //Only add to the list if the fields have values
          var valueLength = 0;
          $(violationEl).find('input, select, textarea').each(function(x, fieldEl){
            var tmpLen = $.trim($(fieldEl).val()).length;
            if (tmpLen > 0 && $(fieldEl).val() != fieldEl.defaultValue){
               valueLength++;
               return false;
            }
          });

          if (valueLength > 0) {
            var tmpId = $(violationEl).attr('id');
            var res = tmpId.replace("subform_container_", "");
            violation_list.push(res);
          }
        }
      });
    });

    if (violation_list.length === 0){
      violation_list.push("NONE");
    }

    // Find all violations selects and replace options with new list
    $(context).find("select[id$='_violations_']").each(function(x, violationSelectEl){
      //Clear out existing options
      $(violationSelectEl).empty();

      //Add new options
      _.each(violation_list, function(i){
        var newOption = $('<option value="' + i + '">' + i + '</option>');
        $(violationSelectEl).append(newOption);
      });
      $(violationSelectEl).trigger("chosen:updated");
    });
  },
});

$(document).ready(function() {
  var violationListReload = new ViolationListReload();
});
