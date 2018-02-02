_primero.Views.ViolationListReload = Backbone.View.extend({
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
    var violation_list = {},
        context = this.el;

    // Build new violations list
    $(context).find("fieldset[id$='_violation_wrapper']").each(function(x, violationListEl){
      var index = 0;  // counter for each type of violation
      var violation_name = $(violationListEl).find(".subforms").attr('id');
      var valueLength = 0;
      $(violationListEl).find(".subforms").children('div').each(function(x, violationEl){
        if ($(violationEl).children().length > 0) {
          //Only add to the list if the fields have values
          $(violationEl).find('input[type!="hidden"], select, textarea').each(function(x, fieldEl){
            var tmpLen = $.trim($(fieldEl).val()).length;
            // don't count radio or tick-box fields as they initailly have a default value which would lead to a false positive
            if (tmpLen > 0 && $(fieldEl).attr('type') != 'radio' && $(fieldEl).attr('type') != 'checkbox'){
               valueLength++;
               return false;
            }
          });

          if (valueLength > 0) {
            // get subform header
            _primero.update_subform_heading(violationEl);
            var subformHeaderEl = $(violationEl).find(".collapse_expand_subform_header");
            var collapsed_value = $(violationEl).find(".collapse_expand_subform_header div.display_field span").text();
            var violation_type = $(violationEl).find(".collapse_expand_subform_header label").text();
            var unique_id = $(violationEl).find("input[type='hidden'][id$='unique_id']").val();
            violation_list[violation_type + " - " + collapsed_value + " - " + unique_id.slice(0, 5)] = unique_id;

            index++;
          }
        }
        valueLength = 0;
      });
    });

    if (violation_list.length === 0){
      violation_list["NONE"] = null;
    }

    // Find all violations selects and replace options with new list
    $(context).find("select[id$='_violations_']").each(function(x, violationSelectEl){
      // Save the select values
      var selectedItems = $(violationSelectEl).val();

      //Clear out existing options
      $(violationSelectEl).empty();

      //Add new options
      _.each(violation_list, function(value, key) {
        var newOption = $('<option value="' + value + '">' + key + '</option>');
        $(violationSelectEl).append(newOption);
      });

      //Add back the select values
      $(violationSelectEl).val(selectedItems);

      $(violationSelectEl).trigger("chosen:updated");
    });
  },
});