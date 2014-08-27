var SubformView = Backbone.View.extend({
  el: '.side-tab-content',

  events: {
    'click .subform_remove': 'remove',
    'click .subform_add': 'add',
    'click .collapse_expand_subform': 'collapse_expand'
  },

  initialize: function() {
    this.heading_removed = false

    //By default existing subforms are collapsed to input.
    this.$el.find(".subform_container, .subform_container:hidden").each(function(x, el){
      //Hide Regular inputs by default.
      $(el).find(".subform div.row:gt(0)").hide();
      $(el).find(".subform div[class='row collapse_expand_subform_header'] span.collapse_expand_subform").each(function(x, el){
        $(el).text("+");
        $(el).addClass("collapsed");
        $(el).removeClass("expanded");
      });
      //TODO: that will be configurable.
    });
  },

  //Event handler to collapse/expand subforms.
  collapse_expand: function(event) {
    event.preventDefault();
    var target = event.target || event.srcElement;
    if ($(target).hasClass("expanded")) {
      $(target).text("+");
      subformEl = $(target).parents(".subform");
      _primero.update_subform_heading(subformEl);
    } else if ($(target).hasClass("collapsed")) {
      //Update the state of the subform.
      $(target).text("-");
      //Initialize the chosen in the subform. 
      //This is because chosen is lazy load until is visible but with the collapse
      //functionality sometimes will be hidden. workaround the subform should initialize.
      $(target).parents(".subform").find(".row select.chosen-select").each(function(x, el) {
        _primero.chosen('#' + el.getAttribute("id"));
      });
    }
    //Update the state of the subform.
    $(target).toggleClass("expanded");
    $(target).toggleClass("collapsed");
    //Hide or Shows the field depends in his current state.
    $(target).parents(".subform").find("div.row:gt(0)").toggle();
    _primero.set_content_sidebar_equality();
  },

  add: function(event) {
    event.preventDefault();
    var target = event.target || event.srcElement,
      //grab the correct template
      template = $(target).parent().prev(),
      //figure out the subforms
      subforms = template.prev(),
      //figure out the next i
      i = 0;
    if (subforms.children().size() > 0){
      i = parseInt(subforms.children(":last").attr("id").split("_").pop()) + 1;
    }

    //clone the template
    var newSubform = template.clone();

    //replace template values, make it visible
    var subformId = newSubform.attr("id").replace("template",i);
    newSubform.attr("id", subformId);

    var fieldsetId = newSubform.find("fieldset").attr("id").replace("template",i);
    newSubform.find("fieldset").attr("id", fieldsetId);

    newSubform.find("label.key").each(function(x, el){
      var for_attr = el.getAttribute("for").replace("template",i);
      el.setAttribute("for", for_attr);
    });

    //This is the static field to shows in collapsed view.
    newSubform.find(".collapse_expand_subform_header .display_field span").each(function(x, el){
      var data_types = el.getAttribute("data-types").replace(/_template_/g, "_" + i + "_");
      var data_fields = el.getAttribute("data-fields").replace(/_template_/g, "_" + i + "_");
      el.setAttribute("data-types", data_types);
      el.setAttribute("data-fields", data_fields);
    });

    newSubform.find("input, select, textarea").each(function(x, el){
      var currentId = el.getAttribute("id")
      if (currentId != null) {
        var id = currentId.replace("template",i);
        el.setAttribute("id", id);
      }

      var currentName = el.getAttribute("name");
      if (currentName != null) {
        var name = currentName.replace("template",i);
        el.setAttribute("name", name);
      }

    });

    newSubform.find("label").each(function(x, el){
      var id = el.getAttribute("for").replace("template",i);
      el.setAttribute("for", id);
    });

    var newSubformClass = newSubform.attr("class").replace("template", "");
    newSubform.attr("class", newSubformClass);
    newSubform.fadeIn(600);
    newSubform.find("input, select, textarea").removeAttr("disabled");
    newSubform.appendTo(subforms);

    // set sidebar height
    _primero.set_content_sidebar_equality();
    
    //Initialize the chosen in the subform
    _primero.chosen('#' + subformId + ' select.chosen-select:visible');

    //After add rows, remove the field that allow remove fields on the server side
    //when all rows were removed.
    $(subforms).parent().find("#" + _primero.model_object + "_" + subforms.attr("id") + "_empty_subform").remove();
  },

  remove: function(event) {
    event.preventDefault();
    var message = $(event.target).data('message'),
        confirm_remove = confirm(message),
        target = event.target || event.srcElement,
        self = this;

    if (confirm_remove == true) {
      var subform = $(target).parent();
      subform.fadeOut(600, function() {
        var subform_group = $(target).parents('.subforms');
        $(this).remove();
        _primero.set_content_sidebar_equality();
        self.count_subforms(subform_group);
        $('body').trigger('violation-removed');
      });
    }
  },

  count_subforms: function(target) {
    var count = 0,
        focus = $(target).attr('id');

    $(target).children('div').each(function (x, el) {
      if ($(el).children().length > 0) {
        count++;
      }
    });
    if (count == 0) {
      //All subforms were removed. Add some input to remove all subforms on the server side.
      //If we don't send this input server will not know that this action needs to be perform.
      //The id is to straightforward lookup the input.
      var id = _primero.model_object + "_" + focus + "_empty_subform";
      var name = _primero.model_object + "[" + focus + "]";
      //don't add the input as a child of the subforms container, this will break the generation of id's.
      $(target).parent().append("<input id=\"" + id + "\" type=\"hidden\" name=\"" + name + "\" value=\"\" />");
    }
  }
});

_primero.update_subform_heading = function(subformEl) {
  //Update the static text with the corresponding input value to shows the changes if any.
  $(subformEl).find(".collapse_expand_subform_header div.display_field span").each(function(x, el){
    //view mode doesn't sent this attributes, there is no need to update the header.
    var data_types_attr = el.getAttribute("data-types");
    var data_fields_attr = el.getAttribute("data-fields");
    if (data_types_attr != null && data_fields_attr != null) {
      //retrieves the fields to update the header.
      var data_types = data_types_attr.split(",");
      var data_fields = data_fields_attr.split(",");
      var values = [];
      for (var i=0; (data_fields.length == data_types.length) && (i < data_fields.length); i++) {
        var input_id = data_fields[i];
        var input_type = data_types[i];
        if (input_type == "chosen_type") {
          //reflect changes of the chosen.
          var input = $(subformEl).find("select[id='" + input_id + "_']");
          if (input.val() != null) {
            values.push(input.val().join(", "));
          }
        } else if (input_type == "radio_button_type") {
          //reflect changes of the for radio buttons.
          var input = $(subformEl).find("input[id^='" + input_id + "']:checked");
          if (input.size() > 0) {
            values.push(input.val());
          }
        } else if (input_type == "check_boxes_type") {
          //reflect changes of the checkboxes.
          var checkboxes_values = [];
          $(subformEl).find("input[id^='" + input_id + "']:checked").each(function(x, el){
            checkboxes_values.push($(el).val());
          });
          if (checkboxes_values.length > 0) {
            values.push(checkboxes_values.join(", "));
          }
        } else {
          //Probably there is other widget that should be manage differently.
          var input = $(subformEl).find("#" + input_id);
          if (input.val() != "") {
            values.push(input.val());
          }
        }
      }
      $(el).text(values.join(" - "));
    }
  });
}


$(document).ready(function() {
  //Disable all template inputs
  $('div.template').find('input, select, textarea').attr("disabled","disabled");

  var subform = new SubformView();
});
