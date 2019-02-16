_primero.Views.LangToggle = _primero.Views.Base.extend({
  el: 'body',

  events: {
    'change .side-tab-content input': 'disable_lang_toggle',
    'change .side-tab-content select': 'disable_lang_toggle'
  },

  initialize: function(){
    $('#lang-toggle-disabled').hide();
  },

  isEditMode: function(){
    return Backbone.history.getFragment().includes("/edit");
  },

  disable_lang_toggle: function() {
    if(this.isEditMode) {
      $('#lang-toggle-disabled').show();
      $('#lang-toggle').hide();
    }
  }
});
