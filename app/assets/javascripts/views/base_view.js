_primero.Views.Base = Backbone.View.extend({
  constructor: function() {
    window.dispatcher.on( 'CloseView', this.close, this );
    Backbone.View.apply(this, arguments);
  },

  close: function() {
    window.dispatcher.off( 'CloseView', this.close, this );
    this.undelegateEvents();
    this.remove();
  }
});
