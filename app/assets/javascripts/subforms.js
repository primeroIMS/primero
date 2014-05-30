var SubformView = Backbone.View.extend({
  el: '.side-tab-content',

  events: {
    'click .subform_remove': 'remove',
    'click .subform_add': 'add'
  },

  initialize: function() {
    this.heading_removed = false
  },

  remove_first_heading: function() {
    if (this.heading_removed == false) {
      $('h5.tool-tip-label:first').remove()
      this.heading_removed = true
    }
  },

  add: function(event) {
    event.preventDefault();

    // removing very first heading
    this.remove_first_heading();

    //grab the correct template
    var template = $(event.srcElement).parent().prev();

    //figure out the subforms
    var subforms = template.prev();

    //figure out the next i
    var i = 0;
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
      var id = el.getAttribute("id").replace("template",i);
      el.setAttribute("id", id);
      var name = el.getAttribute("name").replace("template",i);
      el.setAttribute("name", name);
    });

    var newSubformClass = newSubform.attr("class").replace("template", "");
    newSubform.attr("class", newSubformClass);
//    newSubform.removeAttr("style");
    newSubform.fadeIn(600);
    newSubform.find("input, select").removeAttr("disabled");

    newSubform.appendTo(subforms);
  },

  remove: function(event) {
    event.preventDefault();
    var message = $(event.target).data('message'),
        confirm_remove = confirm(message);

    if (confirm_remove == true) {
      var subform = $(event.srcElement).parent();
      subform.fadeOut(600, function() {
          $(this).remove();
      });
    }
  }
});

$(document).ready(function() {
  //Disable all template inputs
  $('div.template').find('input, select').attr("disabled","disabled");

  var subform = new SubformView();
});
