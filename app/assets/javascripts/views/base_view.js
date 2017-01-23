_primero.Views.Base = Backbone.View.extend({
  constructor: function() {
    window.dispatcher.on( 'CloseView', this.close, this );
    Backbone.View.apply(this, arguments);
  },

  close: function() {
    console.log('cleaning....', this)
    window.dispatcher.off( 'CloseView', this.close, this );
    this.undelegateEvents();
    this.remove();
  }
});
