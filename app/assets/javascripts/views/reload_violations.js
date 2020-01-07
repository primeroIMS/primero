_primero.Views.ViolationListReload = _primero.Views.Base.extend({
  el: '.page_content',

  events: {
    "change fieldset[id$='_violation_wrapper']": 'reload',
    "change #incident_incident_violation_category_": 'show_hide_violations'
  },

  initialize: function() {
    function reload_this() {
      this.reload();
    }
    $('body').on('violation-removed', $.proxy(reload_this, this));

    this.show_hide_violations();
    _primero.show_add_violation_message();
  },

  show_hide_violations: function(e) {
    var $violation_group = $('a[data-violation="true"]'),
      $tabs = $violation_group.parent().find('ul.sub li');
    var $empty_violations = $('.empty_violations');
    $empty_violations.show();

    $empty_violations.parent().find('.subform_add').hide();

    selected = $('span[data-violation-categories]').data('violation-categories') ?
      $('span[data-violation-categories]').data('violation-categories').split(',') :
      $('#incident_incident_violation_category_').val();


    $("fieldset[id$='_violation_wrapper']").find('div[data-form_group_name="violations"]').hide();
    $tabs.hide();
    $violation_group.parent('li').find('.sub li a').removeAttr('active-violation');

    _.each(selected, function(v) {
      $('div[id="' + v + '"]').show();
      $('div[id="' + v + '_violation"]').show();
      $('a[href="#tab_' + v + '_violation_wrapper"]').parent('li').show();
      $('a[href="#tab_' + v + '_violation_wrapper"]').attr("active-violation", 'true');
      $('.empty_violations').hide();
      $('.empty_violations').parent().find('a.subform_add').show();
    });

    var first_violation_href = $violation_group.parent('li')
      .find('.sub li a[active-violation="true"]:first')
      .attr('href');

    $violation_group.attr('href', first_violation_href);
  },


  //Refresh the options in the violations select
  reload: function(event) {
    var violation_list = {},
      context = this.el;
    // Build new violations list
    $(context).find("fieldset[id$='_violation_wrapper']").each(function(x, violationListEl) {
      var $violation_list_el = $(violationListEl);
      var index = 0;  // counter for each type of violation
      var violation_name = $violation_list_el.find(".subforms").attr('id');
      
      $violation_list_el.find(".subforms").children('div').each(function(x, violationEl) {
        var $violation_el = $(violationEl);
        
        if ($violation_el.children().length > 0) {

          //Only add to the list if the fields have values
          var value_length = 0;
          $violation_el.find('input[type!="hidden"], select, textarea').each(function(x, field_el){
            var tmpLen = $.trim($(field_el).val()).length;
            // don't count radio fields as they initailly have a default value which would lead to a false positive
            if (tmpLen > 0 && $(field_el).attr('type') != 'radio') {
               value_length++;
               return false;
            }
          });

          if (value_length > 0) {
            // get subform header
            _primero.update_subform_heading(violationEl);
            var collapsed_value = $violation_el.find(".collapse_expand_subform_header div.display_field span").text();
            var violation_type = $violation_el.find(".collapse_expand_subform_header label").text();
            var unique_id = $violation_el.find("input[type='hidden'][id$='unique_id']").val();
            violation_list[violation_type + " - " + collapsed_value + " - " + unique_id.slice(0, 5)] = unique_id;

            index++;
          }
        }
        valueLength = 0;
      });
    });

    if (violation_list.length === 0) {
      violation_list["NONE"] = null;
    }

    // Find all violations selects and replace options with new list
    $(context).find("select[id$='_violations_']").each(function(x, violationSelectEl){
      var $violation_select_el = $(violationSelectEl);
      // Save the select values
      var selected_items = $violation_select_el.val();

      //Add new options
      var new_options = [];

      _.each(violation_list, function(value, key) {
        var new_option = '<option value="' + value + '">' + key + '</option>';
        new_options.push(new_option)
      });

      $violation_select_el.html(new_options.join(''));

      //Add back the select values
      $violation_select_el.val(selected_items);

      $violation_select_el.trigger("chosen:updated");
    });
  },
});