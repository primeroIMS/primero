var LookupValueView = Backbone.View.extend({
  el: '.side-tab-content',

  events: {
    'click .lookup_value_remove': 'remove',
    'click .lookup_value_add': 'add',
  },

  initialize: function() {
  },

  add: function(event) {
    event.preventDefault();
    //var target = event.target || event.srcElement;
    var valueList = $(this.el).find('#lookup_values'), 
        lastValue = valueList.children(":last"),
        newValue = lastValue.clone();

    newValue.find("input").each(function(x, el){
      $(el).val("");
    });

    newValue.appendTo(valueList);
  },

  remove: function(event) {
    event.preventDefault();
    var target = event.target || event.srcElement,
        targetValue = $(target).parents('div.lookup_value');
    targetValue.remove();
  },

});

$(document).ready(function() {
  //Disable all template inputs
  $('div.template').find('input, select, textarea').attr("disabled","disabled");

  var lookupValues = new LookupValueView();
});
