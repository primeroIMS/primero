//Disable all template inputs
$(document).ready(function() {
  $('div.template').find('input').attr("disabled","disabled");
});


function addSubform(event){
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

  newSubform.find("input").each(function(x, el){
    var id = el.getAttribute("id").replace("template",i);
    el.setAttribute("id", id);
    var name = el.getAttribute("name").replace("template",i);
    el.setAttribute("name", name);
  });

  var newSubformClass = newSubform.attr("class").replace("template", "");
  newSubform.attr("class", newSubformClass);
  newSubform.removeAttr("style");
  newSubform.find("input").removeAttr("disabled");

  newSubform.appendTo(subforms);
}

function removeSubform(event){
  subform = $(event.srcElement).parent();
  subform.remove();
}
