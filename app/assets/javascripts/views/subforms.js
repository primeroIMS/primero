_primero.Views.SubformView = Backbone.View.extend({
  el: '.side-tab-content',

  events: {
    'click .subform_remove': 'remove',
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
        $subform_container.find(".subform").children(".row").not(":first").hide();
      }

      $subform_container.find(".subform div[class='row collapse_expand_subform_header'] span.collapse_expand_subform").each(function(x, el){
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
    $target.parents(".subform").children("div.row:gt(0)").toggle();
    _primero.set_content_sidebar_equality();
  },

  add: function(event) {
    event.preventDefault();
    var target = event.target || event.srcElement;
    var $target = $(target);
    var self = this;
    var $add_button;
    self.add_subform($target);

    //Replicate the event on shared subforms
    var $target_subform = $target.parent().parent().find('div.subforms');
    if ($target_subform.data('is_shared_subform')) {
      $add_button = $('#' + $target_subform.data('shared_subform')).parent().find('a.subform_add');
      self.add_subform($add_button);
    } else {
      $('div[data-shared_subform="' + $target_subform.attr('id') + '"]').each(function() {
        $add_button = $(this).parent().find('a.subform_add');
        self.add_subform($add_button);
      });
    }
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
      $subforms = $template.prev(),
      //figure out the next i
      i = 0;
    if ($subforms.children().size() > 0) {
      i = parseInt($subforms.children(":last").attr("id").split("_").pop()) + 1;
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

    });

    $newSubform.find("label").each(function(x, el){
      var id = el.getAttribute("for").replace("template",i);
      el.setAttribute("for", id);
    });

    var newSubformClass = $newSubform.attr("class").replace("template", "subform");
    $newSubform.attr({
      'data-subform_index': i,
      class: newSubformClass
    });
    $newSubform.fadeIn(600);
    $newSubform.find("input[editable!='false'], select, textarea").removeAttr("disabled");
    $newSubform.appendTo($subforms);

    // set sidebar height
    _primero.set_content_sidebar_equality();

    var newUUID = this.generateUUID();
    $newSubform.find("input:hidden[id$='unique_id']").val(newUUID);

    //Initialize the chosen in the subform
    _primero.chosen('#' + subformId + ' select.chosen-select:visible');

    //After add rows, remove the field that allow remove fields on the server side
    //when all rows were removed.
    $subforms.parent().find("#" + _primero.model_object + "_" + $subforms.attr("id") + "_empty_subform").remove();

    if($newSubform.find('textarea').length > 0) {
      autosize($('textarea'));
    }

    _primero.show_add_violation_message();
  },

  remove: function(event) {
    event.preventDefault();
    var message = $(event.target).data('message'),
      confirm_remove = confirm(message),
      target = event.target || event.srcElement,
      self = this;
    var $target = $(target);
    var $remove_button;

    if (confirm_remove === true) {
      self.remove_subform($target, self);
      var $target_subform = $target.parents('div.subforms');
      var subform_index = $target.parents('div.subform, div.subform_container').data('subform_index');
      if ($target_subform.data('is_shared_subform')) {
        $remove_button = $('#' + $target_subform.data('shared_subform')).find('div[data-subform_index="' + subform_index + '"] a.subform_remove');
        self.remove_subform($remove_button, self);
      } else {
        $('div[data-shared_subform="' + $target_subform.attr('id') + '"]').each(function() {
          $remove_button = $(this).find('div[data-subform_index="' + subform_index + '"] a.subform_remove');
          self.remove_subform($remove_button, self);
        });
      }
    }
    _primero.show_add_violation_message();
  },

  remove_subform: function($target, self) {
    var $subform = $target.parents('fieldset.subform');
    $subform.fadeOut(600, function() {
      var $subform_group = $target.parents('.subforms');
      $(this).remove();
      _primero.set_content_sidebar_equality();
      self.count_subforms($subform_group);
      $('body').trigger('violation-removed');
    });
    _primero.set_content_sidebar_equality();
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
    }
  }
});

function disable_tempate_inputs() {
  //Disable all template inputs
  $('div.template').find('input, select, textarea').attr("disabled","disabled");
}

$(disable_tempate_inputs);
