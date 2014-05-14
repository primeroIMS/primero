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
  var i = subforms.children().size();

  //clone the template
  var newSubform = template.clone();

  //replace template values, make it visible
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
  newSubform.attr("style","");

  newSubform.appendTo(subforms);

}
