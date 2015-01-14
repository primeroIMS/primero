var Primero = Backbone.View.extend({
  el: 'body',

  events: {
    'click .btn_submit': 'submit_form',
    'click .gq_popovers': 'engage_popover',
    'sticky-start .record_controls_container, .index_controls_container': 'start_sticky',
    'sticky-end .record_controls_container, .index_controls_container': 'end_sticky',
    'click .action_btn': 'disable_default_events',
    'change .record_types input:not([type="hidden"])': 'record_type_changed',
  },

  initialize: function() {
    _primero.clean_page_params = this._primero_clean_page_params;
    _primero.get_param = this._primero_get_param;
    _primero.generate_error_message = this._primero_generate_error_message;
    _primero.find_error_messages_container = this._primero_find_error_messages_container;
    _primero.create_or_clean_error_messages_container = this._primero_create_or_clean_error_messages_container;
    _primero.object_to_params = this._primero_object_to_params;
    _primero.filters = this._primero_filters;
    _primero.update_autosum_field = this._primero_update_autosum_field;
    _primero.getInternetExplorerVersion = this._primero_getInternetExplorerVersion;
    _primero.is_under_18 = this._primero_is_under_18;
    _primero.show_add_violation_message = this._primero_show_add_violation_message;
    _primero.loading_screen_indicator = this._primero_show_add_violation_message;

    this.init_sticky();
    this.init_popovers();
    this.init_autogrow();
    this.init_action_menu();
    this.init_chosen_or_new();
    this.show_hide_record_type();
    this.init_scrollbar();
    this.populate_case_id_for_gbv_incidents();

    // TODO: Temp for form customization. Disabling changing a multi-select if options is populated and disabled.
    var textarea = $('textarea[name*="field[option_strings_text"]');
    if (textarea.attr('disabled') == 'disabled') {
      $('textarea[name*="field[option_strings_text"]').parents('form').find('input[name="field[multi_select]"]').attr('disabled', true);
    }

    window.onbeforeunload = this.load_and_redirect;
  },

  init_scrollbar: function() {
    options = {
      axis:"y",
      scrollInertia: 20,
      scrollButtons:{ enable: true }
    };

    $(".side-nav").mCustomScrollbar(
      _.extend(options, {
        setHeight: 350,
        theme: 'minimal-dark',
        callbacks:{
            onInit: function() {
              $('.scrolling_indicator.down').css('visibility', 'visible');
            },
            onScroll: function() {
              $('.scrolling_indicator.down').css('visibility', 'visible');
              $('.scrolling_indicator.up').css('visibility', 'visible');
            },
            onTotalScroll: function(){
              $('.scrolling_indicator.down').css('visibility', 'hidden');
              $('.scrolling_indicator.up').css('visibility', 'visible');
            },
            onTotalScrollBack: function() {
              $('.scrolling_indicator.up').css('visibility', 'hidden');
            }
        }
      })
    );

    $("ul.current_flags").mCustomScrollbar(
      _.extend(options, {
        setHeight: 250,
        theme: 'dark'
      })
    );

    $(".field-controls-multi").mCustomScrollbar(
      _.extend(options, {
        setHeight: 150,
        theme: 'dark'
      })
    );

    $(".panel_xl ul").mCustomScrollbar(
      _.extend(options, {
        setHeight: 578,
        theme: 'dark'
      })
    );

    $(".panel_content ul").mCustomScrollbar(
      _.extend(options, {
        setHeight: 250,
        theme: 'dark'
      })
    );

    $(".reveal-modal .side-tab-content").mCustomScrollbar(
      _.extend(options, {
        setHeight: 400,
        theme: 'dark'
      })
    );

    $(".panel_main").mCustomScrollbar(
      _.extend(options, {
        setHeight: 269,
        theme: 'minimal-dark'
      })
    );

    $(".referral_form_container").mCustomScrollbar(
      _.extend(options, {
        setHeight: 530,
        theme: 'minimal-dark'
      })
    );

    $(".transfer_form_container").mCustomScrollbar(
      _.extend(options, {
        setHeight: 460,
        theme: 'minimal-dark'
      })
    );
  },

  init_chosen_or_new: function() {
    var chosen = $('.chosen-select-or-new').chosen({
      display_selected_options:false,
      width:'100%',
      search_contains: true,
      no_results_text: "Click to add"
    });
    $('body').on('click', 'li.no-results', function(e) {
      var add = $(this).text().match(/Click to add "(.*)"/)[1],
          option = '<option value="' + add + '">'+ add +'</option>',
          select = $(this).parents('.chosen-container').siblings('select');
      select.append(option);
      select.val(add);
      $(chosen).trigger("chosen:updated");
    });
  },

  init_action_menu: function() {
    $('ul.sf-menu').superfish({
      delay: 0,
      speed: 'fast',
      onInit : function() {
        $(this).find('ul').css('display','none');
      }
    });
  },

  init_autogrow: function() {
    $('textarea').autogrow();
  },

  init_popovers: function() {
    var guided_questions = $('.gq_popovers'),
        field = guided_questions.parent().find('input, textarea');

    guided_questions.prev('input, textarea').addClass('has_help');
    guided_questions.popover({
      content: function() {
        return $(this).next('.popover_content').html();
      },
      placement: 'bottom',
      trigger: 'manual'
    });

    field.on('focus', function(evt) {
      guided_questions.popover('hide');

      var field = $(evt.target),
          popover_trigger = $(evt.target).next();

      popover_trigger.popover('show');

      $(evt.target).parent().bind('clickoutside', function(e) {
        popover_trigger.popover('hide');
      });

    });
  },

  engage_popover: function(evt) {
    evt.preventDefault();

    var selected_input = $(evt.target).parent().find('input, textarea');

    selected_input.trigger('focus');
  },

  init_sticky: function() {
    var control = $(".record_controls_container, .index_controls_container"),
    stickem = control.sticky({
      topSpacing: control.data('top'),
      bottomSpacing: control.data('bottom')
    });
  },

  start_sticky: function(evt) {
    $(evt.target).addClass('sticking');
  },

  end_sticky: function(evt) {
    $(evt.target).removeClass('sticking');
  },

  record_type_changed: function(evt) {
    this.show_hide_record_type($(evt.target));
  },

  show_hide_record_type: function(input) {
    var inputs = input ? input : $('.record_types input:not([type="hidden"]');

    inputs.each(function(k, v) {
      var selected_input = $(v),
          section_finder_str = '.section' + '.' + selected_input.val(),
          id_section = $('.associated_form_ids').find(section_finder_str);

      selected_input.is(":checked") ? id_section.fadeIn(800) : id_section.fadeOut(800);
    });
  },

  //Adding the case_id from which the GBV incident is being created.
  //GBV Case should hold list of GBV incidents created using this case.
  populate_case_id_for_gbv_incidents: function() {
    case_id = _primero.get_param("case_id");
    if (case_id) {
      $(".new-incident-form").prepend("<input id='incident_case_id' name='incident_case_id' type='hidden' value='" + case_id + "'>");
    }
  },

  submit_form: function(evt) {
    var button = $(evt.target),
        //find out if the submit button is part of the form or not.
        //if not part will need to add the "commit" parameter to let it know
        //the controller what was triggered.
        parent = button.parents("form.default-form");

    if (parent.length > 0) {
      //Just a regular submit in the form.
      parent.submit();
    } else {
      //Because some design thing we need to add the "commit" parameter
      //to the form because the submit triggered is outside of the form.
      var form = $('form.default-form'),
          commit = form.find("input[class='submit-outside-form']");

      if (commit.length === 0) {
        form.append("<input class='submit-outside-form' type='hidden' name='commit' value='" + button.val() + "'/>");
      } else {
        $(commit).val(button.val());
      }

      form.submit();
    }
    _primero.set_content_sidebar_equality();
  },

  disable_default_events: function(evt) {
    evt.preventDefault();
  },

  // TODO: refactor into Primero when refactoring filters behavior - JT
  _primero_clean_page_params: function(q_param) {
    var source = location.href,
        rtn = source.split("?")[0],
        param,
        params_arr = [],
        query = (source.indexOf("?") !== -1) ? source.split("?")[1] : "";
    if (query !== "") {
        params_arr = query.split("&");
        for (var i = params_arr.length - 1; i >= 0; i -= 1) {
            param = params_arr[i].split("=")[0];
            for(var j = 0; j < q_param.length; j++) {
              if (param === q_param[j] || param.indexOf(q_param) === 0) {
                  params_arr.splice(i, 1);
              }
            }
        }
        rtn = params_arr.join("&");
    } else {
      rtn = "";
    }
    return rtn;
  },

  _primero_get_param: function(param) {
    var query = window.location.search.substring(1);
    var params = query.split("&");
    for (var i=0; i< params.length; i++) {
      var key_val = params[i].split("=");
      if(key_val[0] == param){
        return key_val[1];
      }
      if(key_val[0].indexOf(param) === 0) {
        return key_val[0] + ':' + key_val[1];
      }
    }
    return false;
  },

  //Create the <li /> item to the corresponding error messages.
  //message: message to show.
  //tab: tab where the element that generate the error exists.
  _primero_generate_error_message: function(message, tab) {
    return "<li data-error-item='" + $(tab).attr("id") + "' class='error-item'>"
           + message
           + "</li>";
  },

  //Find the container errors messages.
  _primero_find_error_messages_container: function(form) {
    return $(form).find("div#errorExplanation ul");
  },

  //create or clean the container errors messages: div#errorExplanation.
  _primero_create_or_clean_error_messages_container: function(form) {
    if ($(form).find("div#errorExplanation").length === 0) {
      $(form).find(".tab div.clearfix").each(function(x, el) {
        //TODO make i18n able.
        $(el).after("<div id='errorExplanation' class='errorExplanation'>"
                    + "<h2>Errors prohibited this record from being saved</h2>"
                    + "<p>There were problems with the following fields:</p>"
                    + "<ul/>"
                    + "</div>");
      });
    } else {
      //TODO If we are going to implement other javascript validation
      //     we must refactor this so don't lost the other errors messages.
      $(form).find("div#errorExplanation ul").text("");
    }
  },

  _primero_object_to_params: function(filters) {
    var url_string = "";
    for (var key in filters) {
      if (url_string !==  "") {
        url_string += "&";
      }
      var filter = filters[key];
      if (_.isArray(filter)) {
        filter = filter.join("||");
      }
      url_string += "scope[" + key + "]" + "=" + filter;
    }
    return url_string;
  },

  _primero_filters: {},

  _primero_update_autosum_field: function(input) {
    var autosum_total = 0;
    var autosum_group = input.attr('autosum_group');
    var fieldset = input.parents('.summary_group');
    var autosum_total_input = fieldset.find('input.autosum_total[type="text"][autosum_group="' + autosum_group + '"]');
    fieldset.find('input.autosum[type="text"][autosum_group="' + autosum_group + '"]').each(function(){
      var value = $(this).val();
      if(!isNaN(value) && value !== ""){
        autosum_total += parseFloat(value);
      }
    });
    autosum_total_input.val(autosum_total);
  },

  // Returns the version of Internet Explorer or a -1
  // (indicating the use of another browser).
  _primero_getInternetExplorerVersion: function() {
    var rv = -1; // Return value assumes failure.
    if (navigator.appName == 'Microsoft Internet Explorer')
    {
      var ua = navigator.userAgent;
      var re  = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
      if (re.exec(ua) !== null)
        rv = parseFloat( RegExp.$1 );
    }
    return rv;
  },

  _primero_is_under_18: function(date) {
    if (date) {
      var birthday = new Date(date);
      age = ((Date.now() - birthday) / (31557600000));
      return age < 18 ? true : false;
    } else {
      return false;
    }
  },

  _primero_loading_screen_indicator: function(action) {
    var loading_screen = $('.loading-screen'),
        body = $('body, html');

    switch(action) {
      case 'show':
        loading_screen.show();
        body.css('overflow', 'hidden');
        break;
      case 'hide':
        loading_screen.hide();
        body.css('overflow', 'visible');
        break;
    }
  },

  _primero_show_add_violation_message: function() {
    $("fieldset[id$='_violation_wrapper'] .subforms").each(function(k, v) {
      var elm = $(this),
          message = $(v).parent().prev('.add_violations_message');
      if (elm.children().length <= 0 && !message.prev('.empty_violations').is(':visible')) {
        message.show();
      } else {
        message.hide();
      }
    });
  },

  load_and_redirect: function() {
    if (window.disable_loading_indicator === undefined) {
      _primero.loading_screen_indicator('show');
    }
    window.disable_loading_indicator = undefined;
  }
});

$(document).ready(function() {
  new Primero();

  $(document).on('open.fndtn.reveal', '[data-reveal]', function () {
    $('body').css('overflow','hidden');
  });

  $(document).on('close.fndtn.reveal', '[data-reveal]', function () {
    $('body').css('overflow','visible');
  });
});
