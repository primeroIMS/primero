_primero.Views.Base = Backbone.View.extend({
  constructor: function() {
    var self = this;

    dispatcher.on('CloseView', this.close, this );

    Backbone.View.apply(this, arguments);
  },

  close: function() {
    dispatcher.off( 'CloseView', this.close, this );
    dispatcher.off('CleanTables', this.destroy_all_tables, this);
    this.undelegateEvents();
    this.remove();
  }
});
