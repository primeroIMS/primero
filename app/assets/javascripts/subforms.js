var SubformView = Backbone.View.extend({
  el: '.side-tab-content',

  events: {
    'click .subform_remove': 'remove',
    'click .subform_add': 'add',
    'click .collapse_expand_subform': 'collapse_expand'
  },

  initialize: function() {
    this.heading_removed = false

    //add the collapse/expand button to the existing subforms.
    this.$el.find(".subform_container, .subform_container:hidden").each(function(x, el){
      //Regular inputs will in expanded subforms.
      $(el).find(".subform .row:eq(0) div:last-child").append("<span class=\"collapse_expand_subform expanded\">[-]</span>");
      //Display only data will in collapse subforms.
      $(el).find(".subform .row-static-text:eq(0) div:last-child").append("<span class=\"collapse_expand_subform collapsed\">[+]</span>");
    });

    //By default existing subforms are collapsed to input.
    this.$el.find(".subform_container, .subform_container:hidden").each(function(x, el){
      //Hide Regular inputs by default.
      $(el).find(".subform .row").hide();
      //row-static-text fields will be show by default.
      $(el).find(".subform .row-static-text").show();
      //TODO: that will be configurable.
    });
  },

  //Event handler to collapse/expand subforms.
  collapse_expand: function(event) {
    event.preventDefault();
    var target = event.target || event.srcElement;
    if ($(target).hasClass("expanded")) {
      //Update the static text with the corresponding input value to shows the changes if any.
      $(target).parents(".subform").find(".row span[id$='_static_text']").each(function(x, el){
        var input_id = el.getAttribute("id").replace("_static_text", "");
        if ($(el).hasClass("chosen_type")) {
          //reflect changes of the chosen.
          var input = $(target).parents(".subform").find("select[id='" + input_id + "_']");
          if (input.val() == null) {
            $(el).text("???");
          } else {
            $(el).text(input.val().join(", "));
          }
        } else if ($(el).hasClass("radio_button_type")) {
          //reflect changes of the for radio buttons.
          var input = $(target).parents(".subform").find("input[id^='" + input_id + "']:checked");
          if (input.size() == 0) {
            $(el).text("???");
          } else {
            $(el).text(input.val());
          }
        } else if ($(el).hasClass("check_boxes_type")) {
          //reflect changes of the checkboxes.
          var values = [];
          $(target).parents(".subform").find("input[id^='" + input_id + "']:checked").each(function(x, el){
            values.push($(el).val());
          });
          if (values.length == 0) {
            $(el).text("???");
          } else {
            $(el).text(values.join(", "));
          }
        } else {
          //Probably there is other widget that should be manage differently.
          var input = $(target).parents(".subform").find("#" + input_id);
          $(el).text(input.val() == "" ? "???" : input.val());
        }
      });
    } else if ($(target).hasClass("collapsed")) {
      //Initialize the chosen in the subform. 
      //This is because chosen is lazy load until is visible but with the collapse
      //functionality sometimes will be hidden. workaround the subform should initialize.
      $(target).parents(".subform").find(".row select.chosen-select").each(function(x, el) {
        _primero.chosen('#' + el.getAttribute("id"));
      });
    }
    //Hide or Shows the field depends in his current state.
    $(target).parents(".subform").find(".row").toggle();
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
    newSubform.find("span.value").each(function(x, el){
      var new_id = el.getAttribute("id").replace("template",i);
      el.setAttribute("id", new_id);
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

    //Add the collapse/expand button to the new subform.
    newSubform.find(".subform .row:eq(0) div:last-child").append("<span class=\"collapse_expand_subform expanded\">[-]</span>");
    newSubform.find(".subform .row-static-text:eq(0) div:last-child").append("<span class=\"collapse_expand_subform collapsed\">[+]</span>");

    newSubform.find("label").each(function(x, el){
      var id = el.getAttribute("for").replace("template",i);
      el.setAttribute("for", id);
    });

    var newSubformClass = newSubform.attr("class").replace("template", "");
    newSubform.attr("class", newSubformClass);
//    newSubform.removeAttr("style");
    newSubform.fadeIn(600);
    newSubform.find("input, select, textarea").removeAttr("disabled");

    //make sure static text placeholder is hide in the new subform.
    newSubform.find(".row-static-text").hide();

    newSubform.appendTo(subforms);

    // set sidebar height
    _primero.set_content_sidebar_equality();
    
    //Initialize the chosen in the subform
    _primero.chosen('#' + subformId + ' select.chosen-select:visible');
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
    if (count == 0)
      $(target).append("<input type=\"hidden\" name=\"" + _primero.model_object + "[" + focus + "]\" value=\"\" />");
  }
});

$(document).ready(function() {
  //Disable all template inputs
  $('div.template').find('input, select, textarea').attr("disabled","disabled");

  var subform = new SubformView();
});
