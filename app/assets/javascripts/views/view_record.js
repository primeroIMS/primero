_primero.Views.viewRecord = _primero.Views.Base.extend({
  el: ".page_container",

  events: {
    "click .record-view-modal": "show_record_view_modal"
  },

  show_record_view_modal: function(event) {
    event.preventDefault();
    var record = $(event.target).data("record");
    var view_modal = $("#viewModal");

    view_modal.html(
      JST["templates/view_record"]({ data: record })
    );

    view_modal.trigger("open");
  }
});
