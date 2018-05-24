_primero.Views.viewRecord = _primero.Views.Base.extend({
  el: ".page_container",

  events: {
    "click .record-view-modal": "show_record_view_modal",
    "click .potential-match-view-modal": "show_potential_match_modal",
    "closed.zf.reveal body": "clear_modal"
  },

  initialize: function() {
    _.bindAll(this, "show_request_transfer_modal");
  },

  clear_modal: function() {
    $("#viewModal").empty();
  },

  populate_modal: function(path, cb) {
    var view_modal = $("#viewModal");

    $.get(path, {}, function(html) {
      view_modal.html(html);

      if (cb) {
        cb();
      }
    });

    view_modal.trigger("open");
    view_modal.on("closed.zf.reveal", this.clear_modal);
  },

  show_request_transfer_modal: function(event) {
    event.preventDefault();
    var record = $(event.target).data("record");
    var view_path = "/cases/" + record + "/request_transfer_view";
    var self = this;

    this.populate_modal(view_path, function() {
      $(document).on(
        "click",
        ".submit_transfer_request",
        self.submit_transfer_request
      );
    });
  },

  submit_transfer_request: function(event) {
    event.preventDefault();
    var form_data = $(event.target)
      .parents("form")
      .serialize();

    $.ajax({
      url: "/cases/request_transfer",
      data: form_data,
      dataType: 'json',
      method: 'PUT',
      success: function(response) {
        if (response.success) {
          location.reload(true);
        } else {
          if (response.reload_page) {
            location.reload(true);
          }
        }
      }
    });
  },

  show_record_view_modal: function(event) {
    event.preventDefault();
    var record = $(event.target).data("record");
    var view_path = "/cases/" + record + "/quick_view";
    var self = this;

    this.populate_modal(view_path, function() {
      $(document).on(
        "click",
        ".request-transfer-modal",
        self.show_request_transfer_modal
      );
    });
  },

  show_potential_match_modal: function(event) {
    event.preventDefault();
    var tracing_request_id = $(event.target).data("tracing-request-id");
    var child_id = $(event.target).data("child-id");
    var tr_subform_id =  $(event.target).data("tr-subform-id");
    var view_path = "/potential_matches/quick_view" +
      "?tracing_request_id=" + tracing_request_id +
      "&child_id=" + child_id +
      "&tr_subform_id=" + tr_subform_id;
    var self = this;
    this.populate_modal(view_path);
  }

});
