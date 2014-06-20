var SubformView = Backbone.View.extend({
  el: '.side-tab-content',

  events: {
    'click .subform_remove': 'remove',
    'click .subform_add': 'add'
  },

  initialize: function() {
    this.heading_removed = false
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

    newSubform.find("input, select").each(function(x, el){
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
//    newSubform.removeAttr("style");
    newSubform.fadeIn(600);
    newSubform.find("input, select").removeAttr("disabled");

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
        self.count_subforms(subform_group);
      });
    }

    _primero.set_content_sidebar_equality();
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
  $('div.template').find('input, select').attr("disabled","disabled");

  var subform = new SubformView();
});
