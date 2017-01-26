_primero.Views.LookupValueView = _primero.Views.Base.extend({
  el: '.side-tab-content',

  events: {
    'click .lookup_value_remove': 'removeLookup',
    'click .lookup_value_add': 'addLookup',
  },

  initialize: function() {
  },

  addLookup: function(event) {
    event.preventDefault();
    var $value_list = $(this.el).find('#lookup_values'),
        $last_value = $value_list.children(":last"),
        $new_value = $last_value.clone();

    $new_value.find("input").each(function(x, el){
      $(el).val("");
    });

    $new_value.appendTo($value_list);
  },

  removeLookup: function(event) {
    event.preventDefault();
    var $value_list = $(this.el).find('#lookup_values'),
        list_cnt = $value_list.children().length;
        target = event.target || event.srcElement,
        $target_value = $(target).parents('.lookup_value');

    //Do not allow removal of last two inputs
    if(list_cnt > 2){
      $target_value.remove();
    }
  },

});