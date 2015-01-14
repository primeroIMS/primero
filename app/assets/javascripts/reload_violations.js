var ViolationListReload = Backbone.View.extend({
  el: '.page_content',

  events: {
    "change fieldset[id$='_violation_wrapper']": 'reload',
    "change select#incident_incident_violation_category_": 'show_hide_violations'
  },

  initialize: function() {
    $('body').on('violation-removed', $.proxy(function() {
      this.reload();
    }, this));

    this.show_hide_violations();
    _primero.show_add_violation_message();
  },

  show_hide_violations: function(e) {
    var violation_group = $('a[data-violation="true"]'),
        tabs = $('a[data-violation="true"]').parent().find('ul.sub li');

    $('.empty_violations').show();

    $('.empty_violations').parent().find('a.subform_add').hide();

    selected = $('span[data-violation-categories]').data('violation-categories') ?
        $('span[data-violation-categories]').data('violation-categories').split(',') :
        $('select#incident_incident_violation_category_').val();


    $("fieldset[id$='_violation_wrapper']").find('div[data-form_group_name="violations"]').hide();
    tabs.hide();
    $('a[data-violation="true"]').parent('li').find('ul.sub li a').removeAttr('active-violation');

    _.each(selected, function(v) {
      $('div[id="' + v + '"]').show();
      $('div[id="' + v + '_violation"]').show();
      $('a[href="#tab_' + v + '_violation_wrapper"]').parent('li').show();
      $('a[href="#tab_' + v + '_violation_wrapper"]').attr("active-violation", 'true');
      $('.empty_violations').hide();
      $('.empty_violations').parent().find('a.subform_add').show();
    });

    var first_violation_href = violation_group.parent('li')
                                              .find('ul.sub li a[active-violation="true"]:first')
                                              .attr('href');

    $('a[data-violation="true"]').attr('href', first_violation_href);
  },


  //Refresh the options in the violations select
  reload: function(event) {
    var violation_list = [],
        context = this.el;

    // Build new violations list
    $(context).find("fieldset[id$='_violation_wrapper']").each(function(x, violationListEl){
      var index = 0;  // counter for each type of violation
      var violation_name = $(violationListEl).find(".subforms").attr('id');
      $(violationListEl).find(".subforms").children('div').each(function(x, violationEl){
        if ($(violationEl).children().length > 0) {

          //Only add to the list if the fields have values
          var valueLength = 0;
          $(violationEl).find('input, select, textarea').each(function(x, fieldEl){
            var tmpLen = $.trim($(fieldEl).val()).length;
            // don't count radio fields as they initailly have a default value which would lead to a false positive
            if (tmpLen > 0 && $(fieldEl).attr('type') != 'radio'){
               valueLength++;
               return false;
            }
          });

          if (valueLength > 0) {
            // get subform header
            _primero.update_subform_heading(violationEl);
            var subformHeaderEl = $(violationEl).find(".collapse_expand_subform_header");
            var tmpValue = $(violationEl).find(".collapse_expand_subform_header div.display_field span").text();
            var tmpRes = $(violationEl).find(".collapse_expand_subform_header label").text();
            var res = tmpRes + " " + tmpValue + " " + index;
            violation_list.push(res);

            //If hidden input field 'violation_id' exists, update it.  Otherwise add it.
            if($(violationEl).find("input[id$='_violation_id']").length > 0){
              violationIdEl = $(violationEl).find("input[id$='_violation_id']");
              violationIdEl.val(res);
            }else{
              var i = parseInt($(violationEl).attr("id").split("_").pop());
              var id = _primero.model_object + "_violations_" + violation_name + "_" + i + "_violation_id";
              var name = _primero.model_object + "[violations][" + violation_name + "][" + i + "][violation_id]";
              $(subformHeaderEl).append("<input id=\"" + id + "\" type=\"hidden\" name=\"" + name + "\" value=\"" + res + "\" />");
            }

            index++;
          }
        }
      });
    });

    if (violation_list.length === 0){
      violation_list.push("NONE");
    }

    // Find all violations selects and replace options with new list
    $(context).find("select[id$='_violations_']").each(function(x, violationSelectEl){
      // Save the select values
      var selectedItems = $(violationSelectEl).val();

      //Clear out existing options
      $(violationSelectEl).empty();

      //Add new options
      _.each(violation_list, function(i){
        var newOption = $('<option value="' + i + '">' + i + '</option>');
        $(violationSelectEl).append(newOption);
      });

      //Add back the select values
      $(violationSelectEl).val(selectedItems);

      $(violationSelectEl).trigger("chosen:updated");
    });
  },
});

$(document).ready(function() {
  var violationListReload = new ViolationListReload();
});
