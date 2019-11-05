_primero.Views.SubformView = _primero.Views.Base.extend({
  el: '.side-tab-content',

  events: {
    'click .subform_remove': 'removeSubform',
    'click .subform_add': 'add',
    'click .collapse_expand_subform': 'collapse_expand'
  },

  initialize: function() {
    this.heading_removed = false;

    //By default existing subforms are collapsed to input.
    this.$el.find(".subform_container, .subform_container:hidden").each(function(x, el){
      var $subform_container = $(el);
      //Hide Regular inputs by default unless it is a summary section.
      if (!$subform_container.find('span.collapse_expand_subform').hasClass('summary_section')) {
        $subform_container.find(".subform:not(.new)").children(".row").not(":first").hide();
      }

      $subform_container.find(".subform.subform:not(.new) div[class='row collapse_expand_subform_header'] span.collapse_expand_subform").each(function(x, el){
        var $subform = $(el);
        $subform.text("+");
        $subform.addClass("collapsed");
        $subform.removeClass("expanded");
      });
      //TODO: that will be configurable.
    });
  },

  //Event handler to collapse/expand subforms.
  collapse_expand: function(event) {
    event.preventDefault();
    var target = event.target || event.srcElement;
    var $target = $(target);
    if ($target.hasClass("expanded")) {
      $target.text("+");
      subformEl = $target.parents(".subform");
      _primero.update_subform_heading(subformEl);
    } else if ($target.hasClass("collapsed")) {
      //Update the state of the subform.
      $target.text("-");
      //Initialize the chosen in the subform.
      //This is because chosen is lazy load until is visible but with the collapse
      //functionality sometimes will be hidden. workaround the subform should initialize.
      $target.parents(".subform").find(".row select.chosen-select").each(function(x, el) {
        _primero.chosen('#' + el.getAttribute("id"));
      });
    }
    // Update the state of the subform.
    $target.toggleClass("expanded");
    $target.toggleClass("collapsed");
    //Hide or Shows the field depends in his current state.
    $target.parents(".subform").children(".row:gt(0)").toggle();
  },

  add: function(event) {
    event.preventDefault();
    var target = event.target || event.srcElement;
    var $target = $(target);
    var self = this;
    var $add_button;
    self.add_subform($target);

    $target.prev('.placeholder_text').hide();

    //Replicate the event on shared subforms
    var $target_subform = $target.parent().parent().find('.subforms');

    if ($target_subform.data('is_shared_subform')) {
      $add_button = $('#' + $target_subform.data('shared_subform')).parent().find('.subform_add');
      self.add_subform($add_button);
    } else {
      $('div[data-shared_subform="' + $target_subform.attr('id') + '"]').each(function() {
        $add_button = $(this).parent().find('.subform_add');
        self.add_subform($add_button);
      });
    }

    setTimeout(function(){
      // Initialize the select boxes that get populated through apis.
      var $new_subform = $target.closest(".row").find(".subform_container").last(); //Last added subform
      var string_sources = ["Location", "ReportingLocation", "User", "Agency use_api"];
      _.each(string_sources, function(string_source) {
        var selects = $new_subform.find('select[data-populate="'+string_source+'"]');
        selects.each(function(index, elem){
          var $elem = $(elem);
          var select_id = "#" + $elem.attr("id");
          switch(string_source){
            case "Location": {
              new _primero.Views.PopulateLocationSelectBoxes({ el: select_id }).initAutoComplete($elem);
            } break;
            case "ReportingLocation": {
              new _primero.Views.PopulateReportingLocationSelectBoxes({ el: select_id }).initAutoComplete($elem);
            } break;
            case "Agency use_api": {
              new _primero.Views.PopulateAgencySelectBoxes({ el: select_id }).initAutoComplete($elem);
            } break;
            case "User": {
              new _primero.Views.PopulateUserSelectBoxes({ el: select_id }).initAutoComplete($elem);
            } break;
          }
        });
      });
    }, 0); //Try to run after the fadeOut in the forms
  },

  // From: http://stackoverflow.com/a/8809472/1009106
  generateUUID: function() {
    var d = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = (d + Math.random()*16)%16 | 0;
      d = Math.floor(d/16);
      return (c=='x' ? r : (r&0x3|0x8)).toString(16);
    });
    return uuid;
  },

  add_subform: function($target) {
    //grab the correct template
    var $template = $target.parent().prev(),
      //figure out the subforms
      $subforms_container = $template.prev(),
      $subforms = $subforms_container.children(".subform_container"),
      //figure out the next i
      i = 0;
    if ($subforms.size() > 0) {
      i = Math.max.apply(null, $.map($subforms, function(subform){
        return parseInt($(subform).attr("id").split("_").pop());
      }));
      i += 1
    }

    //clone the template
    var $newSubform = $template.clone();

    //replace template values, make it visible
    var subformId = $newSubform.attr("id").replace("template", i);
    $newSubform.attr("id", subformId);

    var fieldsetId = $newSubform.find("fieldset").attr("id").replace("template", i);
    $newSubform.find("fieldset").attr("id", fieldsetId);

    $newSubform.find("label.key").each(function(x, el){
      var for_attr = el.getAttribute("for").replace("template", i);
      el.setAttribute("for", for_attr);
    });

    //This is the static field to shows in collapsed view.
    $newSubform.find(".collapse_expand_subform_header .display_field span").each(function(x, el){
      var data_types = el.getAttribute("data-types").replace(/_template_/g, "_" + i + "_");
      var data_fields = el.getAttribute("data-fields").replace(/_template_/g, "_" + i + "_");
      el.setAttribute("data-types", data_types);
      el.setAttribute("data-fields", data_fields);
    });

    $newSubform.find("input, select, textarea").each(function(x, el){
      var currentId = el.getAttribute("id");
      if (currentId !== null) {
        var id = currentId.replace("template",i);
        el.setAttribute("id", id);
      }

      var currentName = el.getAttribute("name");
      if (currentName !== null) {
        var name = currentName.replace("template",i);
        el.setAttribute("name", name);
      }

      if (el.getAttribute('required') || el.getAttribute('data-validator')) {
        el.removeAttribute('data-abide-ignore');
      }
    });

    $newSubform.find("label").each(function(x, el){
      var id = el.getAttribute("for").replace("template",i);
      el.setAttribute("for", id);
    });

    var newSubformClass = $newSubform.attr("class").replace("template", "subform_container");
    $newSubform.attr({
      'data-subform_index': i,
      class: newSubformClass
    });
    $newSubform.fadeIn(600);
    $newSubform.find("input, select, textarea").filter('[is_disabled=false]').removeAttr("disabled");
    $newSubform.appendTo($subforms_container);

    // set sidebar height

    var newUUID = this.generateUUID();
    $newSubform.find("input:hidden[id$='unique_id']").val(newUUID);

    //Initialize the chosen in the subform
    _primero.chosen('#' + subformId + ' select.chosen-select:visible');

    //After add rows, remove the field that allow remove fields on the server side
    //when all rows were removed.
    $subforms_container.parent().find("#" + _primero.model_object + "_" + $subforms_container.attr("id") + "_empty_subform").remove();

    if($newSubform.find('textarea').length > 0) {
      autosize($('textarea'));
    }

    _primero.show_add_violation_message();

    Foundation.reInit('abide');
  },

  removeSubform: function(event) {
    event.preventDefault();
    var message = $(event.target).data('message'),
      confirm_remove = confirm(message),
      target = event.target || event.srcElement,
      self = this;
    var $target = $(target);
    var $remove_button;

    if (confirm_remove === true) {
      self.remove_subform($target, self);
      var $target_subform = $target.parents('.subforms');
      var subform_index = $target.parents('.subform, .subform_container').data('subform_index');
      if ($target_subform.data('is_shared_subform')) {
        $remove_button = $('#' + $target_subform.data('shared_subform')).find('div[data-subform_index="' + subform_index + '"] .subform_remove');
        self.remove_subform($remove_button, self);
      } else {
        $('div[data-shared_subform="' + $target_subform.attr('id') + '"]').each(function() {
          $remove_button = $(this).find('div[data-subform_index="' + subform_index + '"] .subform_remove');
          self.remove_subform($remove_button, self);
        });
      }
    }
    _primero.show_add_violation_message();
  },

  remove_subform: function($target, self) {
    //TODO: This code has not been tested with grouped subforms. It might not work correctly.
    var $subform = $target.parents('fieldset.subform');
    has_required_fields = $subform.find('input[required], select[required]').length;

    $subform.fadeOut(600, function() {
      var $subform_group = $target.parents('.subforms');

      $(this).remove();
      self.count_subforms($subform_group);
      $('body').trigger('violation-removed');

      if (has_required_fields) {
        Foundation.reInit('abide');
      }
    });
  },

  count_subforms: function($target) {
    var count = 0,
      focus = $target.attr('id');

    $target.children('div').each(function (x, el) {
      if ($(el).children().length > 0) {
        count++;
      }
    });
    if (count === 0) {
      //All subforms were removed. Add some input to remove all subforms on the server side.
      //If we don't send this input server will not know that this action needs to be perform.
      //The id is to straightforward lookup the input.
      var id = _primero.model_object + "_" + focus + "_empty_subform";
      var form_group_name = $target.data('form_group_name');
      var name = _primero.model_object;
      if (form_group_name.length > 0 && form_group_name == "violations") {
        name += "[" + form_group_name + "]";
      }
      name += "[" + focus + "]";
      //don't add the input as a child of the subforms container, this will break the generation of id's.
      $target.parent().append("<input id=\"" + id + "\" type=\"hidden\" name=\"" + name + "\" value=\"\" />");
      $target.parent().find('.placeholder_text').show();
    }
  }
});
