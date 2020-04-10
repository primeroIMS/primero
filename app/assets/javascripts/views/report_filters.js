_primero.Views.ReportFilters = Backbone.View.extend({
  template: JST["templates/reports_filters_selected"],

  el: "#report_filter_controls",

  events: {
    "change .date_filter .selector select": "filter_type_event",
    "click .close, .open": "toggle_filter_panel",
    "click .clear_filters": "clear_filters",
    "click .submit_filters": "filter",
    'change input[name="date_from_control"]': "populateTo",
    "change .select_filter select": "set_select_filter",
    "change .date_filter .controls select, .date_filter .controls input":
      "set_date_filter"
  },

  initialize: function() {
    this.report_filters = {};
    _primero.chosen("#report_filter_controls .chosen-select");
    this.set_params();
  },

  set_select_filter: function(e) {
    var select = $(e.target);
    var value = select.val();
    var id = select.attr("id");

    this.report_filters[id] = value;
  },

  set_date_filter: function(e) {
    var date_control = $(e.target);
    var container = date_control.parents(".date_filter");
    var field = container.find(".selector select");
    var from = container
      .find(".control input[name$='date_from_control']")
      .val();
    var to = container.find(".control input[name$='date_to_control']").val();
    var value = date_control.is("select")
      ? date_control.val()
      : [from, to].join(".");

    this.report_filters[field.attr("name")] = [field.val(), value].join("||");
  },

  populateTo: function(e) {
    var from_field = $(e.target);
    var to_field = from_field
      .parents(".control")
      .find("input[name$='date_to_control']");

    if (!to_field.val() && from_field.val()) {
      to_field.val(from_field.val());
    }
  },

  filter: function(e) {
    this.clean_report_filters();
    window.location.search = _primero.object_to_params(this.report_filters);
  },

  display_selected_filters: function() {
    $(this.el)
      .find(".filters-selected")
      .html(
        this.template({
          m: this.report_filters
        })
      );
  },

  set_params: function() {
    var params = this.parse_params(window.location.search.split("?")[1] || "");

    if (!_.isEmpty(params)) {
      this.report_filters = params.scope;
      this.clean_report_filters();
      this.display_selected_filters();
      this.set_filters();
    }
  },

  clean_report_filters: function() {
    var self = this;

    return _.each(self.report_filters, function(v, k) {
      if (v == null || v == "null") {
        delete self.report_filters[k];
      }
    });
  },

  set_filters: function() {
    var self = this;

    _.each(this.report_filters, function(v, k) {
      var filter = v.split("||");
      var control = $("select#" + k);
      var value;

      if (/date/.test(k)) {
        var subValue = filter[1].split(".");
        var container = control.parents(".date_filter");

        value = filter[0];
        control.val(value);
        self.toggle_date_control(control);

        if (subValue.length > 1) {
          container
            .find(".control input[name$='date_from_control']")
            .val(subValue[0]);
          container
            .find(".control input[name$='date_to_control']")
            .val(subValue[1]);
        } else {
          container.find(".controls select").val(subValue[0]);
        }
      } else { 
        control.val(control.prop("multiple") ? filter : _.first(filter));
        control.trigger("chosen:updated");
      }
    });
  },

  toggle_filter_panel: function(e) {
    var action = e.target.dataset.action === "close" ? "slideUp" : "slideDown";
    var openButton = $(".open");
    var panel = $(this.el).find(".panel");

    if (action === "slideDown") {
      openButton.addClass("currently");
    } else {
      panel.css("overflow", "hidden");
    }

    panel[action]({
      complete: function() {
        if (action === "slideUp") {
          openButton.removeClass("currently");
        } else {
          panel.css("overflow", "visible");
        }
      }
    });
  },

  filter_type_event: function(e) {
    e.preventDefault();
    var selector = $(e.target);
    this.toggle_date_control(selector);
  },

  toggle_date_control: function(selector) {
    var container = selector.parents(".date_filter");
    var value = selector.val();
    var text = selector.find("option:selected").text();

    var selected_control = (function(value) {
      switch (value) {
        case "day":
          return "range";
          break;
        case "year":
          return "select";
          break;
      }
    })(value);

    this.reset_date_controls(container);

    if (selected_control == "select") {
      container.find(".select.control label").html(text);
    }

    if (value == "year") {
      container
        .find(".select.control select")
        .append(this.generate_date_options(value));
    }

    container.find(".controls ." + selected_control).removeClass("hide");
  },

  generate_date_options: function(value) {
    var options = [];

    if (value == "year") {
      var min = new Date().getFullYear();
      var max = min + 10;

      for (var i = min - 10; i <= max; i++) {
        var opt = document.createElement("option");
        opt.value = i;
        opt.innerHTML = i;

        options.push(opt);
      }
    }

    return options;
  },

  reset_date_controls: function(container) {
    container.find(".control").addClass("hide");
    container.find(".select label").html("");
  },

  parse_params: function(query) {
    var params = {};
    var e;
    var re = /([^&=]+)=?([^&]*)/g;
    var decodeRE = /\+/g;
    var decode = function(str) {
      return decodeURIComponent(str.replace(decodeRE, " "));
    };

    while ((e = re.exec(query))) {
      var k = decode(e[1]),
        v = decode(e[2]);
      var b = k.match(/^(\w*)\b\[(\w+)\]/);

      if (k.substring(k.length - 2) === "[]") {
        k = k.substring(0, k.length - 2);
        (params[k] || (params[k] = [])).push(v);
      } else if (b) {
        if (!params[b[1]]) {
          params[b[1]] = {};
        }
        params[b[1]][b[2]] = v;
      } else {
        params[k] = v;
      }
    }

    return params;
  },

  clear_filters: function() {
    window.location = window.location.origin + window.location.pathname;
    return false;
  }
});
