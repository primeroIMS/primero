Primero = _primero.Views.Base.extend({
  el: 'body',

  events: {
    'click .btn_submit': 'submit_form',
    'click .gq_popovers': 'engage_popover',
    'click .gq_select_popovers': 'engage_select_popover',
    'sticky-start .record_controls_container, .index_controls_container': 'start_sticky',
    'sticky-end .record_controls_container, .index_controls_container': 'end_sticky',
    'click .action_btn': 'disable_default_events',
    'change .record_types input:not([type="hidden"])': 'record_type_changed',
    'click #audio_link, .document, .bulk_export_download': '_primero_check_download_status',
    'click .download_forms': '_primero_check_status_close_modal',
    'click .create_cp_incident_modal': 'load_and_redirect'

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
    _primero.loading_screen_indicator = this._primero_loading_screen_indicator;
    _primero.serialize_object = this._primero_serialize_object;
    _primero.check_download_status = this._primero_check_download_status;
    _primero.check_status_close_modal = this._primero_check_status_close_modal;
    _primero.remove_cookie = this._primero_remove_cookie;
    _primero.read_cookie = this._primero_read_cookie;
    _primero.create_cookie = this._primero_create_cookie;
    _primero.scrollTop = this.scrollTop;
    _primero.update_subform_heading = this.update_subform_heading;
    _primero.abide_validator_date = this.abide_validator_date;
    _primero.abide_validator_date_not_future = this.abide_validator_date_not_future;
    _primero.date_not_future = this.date_not_future;
    _primero.valid_datepicker_value = this.valid_datepicker_value;
    _primero.abide_validator_positive_number = this.abide_validator_positive_number;
    _primero.valid_positive_number_value = this.valid_positive_number_value;
    _primero.generate_download_link = this.generate_download_link;
    _primero.init_autosize = this.init_autosize;
    _primero.request_confirmation = this.request_confirmation;
    _primero.map_filter_object = this.map_filter_object;
    _primero.get_filter = this.get_filter;
    _primero.apply_filters = this.apply_filters;

    this.init_trunc();
    this.init_sticky();
    this.init_popovers();
    this.init_autosize();
    this.init_action_menu();
    this.init_chosen_or_new();
    this.show_hide_record_type();
    this.init_scrollbar();
    this.populate_case_and_incident_detail_id_for_incidents();
    this.init_edit_listeners();
    this.chosen_roles();

    // TODO: Temp for form customization. Disabling changing a multi-select if options is populated and disabled.
    var $textarea = $('textarea[name*="field[option_strings_text"]');
    if ($textarea.attr('disabled') == 'disabled') {
      $('textarea[name*="field[option_strings_text"]').parents('form').find('input[name="field[multi_select]"]').attr('disabled', true);
    }

    $(document).on('closed.zf.reveal', 'body', this.clear_modal_form);

    $(document).on('open.zf.reveal', 'body', function() {
      _primero.chosen('.chosen-select');
    });

    $('.alert_message').each(function() {
      $(this).parents('fieldset').prepend(this)
    });

    var targetNodes = $('*[data-equalizer-watch]').children();
    var MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
    var myObserver = new MutationObserver(mutationHandler);
    var obsConfig = {
      childList: true,
      attributes: true,
      subtree: true,
      attributeOldValue: true
    };

    targetNodes.each(function() {
      myObserver.observe(this, obsConfig);
    });

    function mutationHandler(mutations) {
      dom_change = _.find(mutations, function(mutation) {
        return (mutation.attributeName == 'style' && (mutation.oldValue == 'display: block;' || mutation.oldValue == 'display: none;')) && mutation.target.nodeName !== 'SELECT';
      });

      if (typeof dom_change !== 'undefined') {
        Foundation.reInit('equalizer');
      }
    }

    $('input[type="text"], textarea').attr('autocomplete', 'new-password');

    window.onbeforeunload = this.load_and_redirect;
  },

  request_confirmation: function(callback) {
    var warn_leaving = confirm(_primero.discard_message);
    if (warn_leaving) {
      callback();
    } else {
      return false;
    }
  },

  init_edit_listeners: function() {
    if ((_.indexOf(['new', 'edit', 'update'], _primero.current_action) > -1) &&
        (['session','contact_information','system_setting'].indexOf(_primero.model_object) < 0)) {
      function redirect_with_warning(e) {
        e.preventDefault();
        e.stopImmediatePropagation();
        var $target = $(this);
        _primero.request_confirmation(function() {
          if ($target.is(':button')) {
            $target.submit();
          } else {
            window.location = $target.attr('href');
          }
        });
      }

      var event_selector = 'nav a, nav button, header a, .static_links a';
      var exit_handler = _.find($(document).data('events').click, function(handler) {
        return handler.selector == event_selector;
      });

      if (typeof exit_handler === 'undefined') {
        $(document).on('click', event_selector, redirect_with_warning);
      }
    }
  },

  chosen_roles: function() {
    _primero.chosen('#chosen_role');
  },

  init_trunc: function() {
    String.prototype.trunc = String.prototype.trunc ||
      function(n){
        return this.length>n ? this.substr(0,n-1)+'...' : this;
      };
  },

  init_scrollbar: function() {
    options = {
      axis:"y",
      scrollInertia: 20,
      scrollButtons:{ enable: true },
      autoHideScrollbar: false,
      theme: 'dark'
    };
    $(".side-nav").mCustomScrollbar(
      _.extend(options, {
        setHeight: 460,
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

    var $current_flags = $(".current_flags");
    $current_flags.mCustomScrollbar(_.extend(options, { setHeight: "auto" }));
    $current_flags.css("max-height", "250px");

    $current_flags.mCustomScrollbar(_.extend(options, { setHeight: "auto" }));
    $current_flags.css("max-height", "175px");

    $(".field-controls-multi, .scrollable").mCustomScrollbar(_.extend(options, { setHeight: 150 }));

    $(".panel_xl ul").mCustomScrollbar(_.extend(options, { setHeight: 578 }));

    $(".panel_content ul").mCustomScrollbar(_.extend(options, { setHeight: 250 }));

    $(".panel_main").mCustomScrollbar(_.extend(options, { setHeight: 400 }));
  },

  init_chosen_or_new: function() {
    var chosen = $('.chosen-select-or-new').chosen({
      display_selected_options:false,
      width:'100%',
      search_contains: true,
      no_results_text: "Click to add"
    });
    $('body').on('click', '.no-results', function(e) {
      var add = $(this).text().match(/Click to add "(.*)"/)[1],
          option = '<option value="' + add + '">'+ add +'</option>',
          select = $(this).parents('.chosen-container').siblings('select');
      select.append(option);
      select.val(add);
      $(chosen).trigger("chosen:updated");
    });
  },

  init_action_menu: function() {
    $('.sf-menu').superfish({
      delay: 0,
      speed: 'fast',
      onInit : function() {
        $(this).find('ul').css('display','none');
      }
    });
  },

  init_autosize: function() {
    autosize($('textarea'));
  },

  init_popovers: function() {
    var $guided_questions = $('.gq_popovers'),
      $field = $guided_questions.parent().find('input, textarea, select');

    $guided_questions.parent().find('input, textarea, select').addClass('has_help');
    $guided_questions.popover({
      content: function() {
        return $(this).parent().find('.popover_content').html();
      },
      placement: 'bottom',
      trigger: 'manual'
    });

    $field.on('focus', function(evt) {
      $guided_questions.popover('hide');

      var $field = $(evt.target),
        $popover_trigger = $field.parent().find('a.gq_popovers');

      $popover_trigger.popover('show');

      $field.parent().bind('clickoutside', function(e) {
        $popover_trigger.popover('hide');
      });
    });
  },

  engage_popover: function(evt) {
    evt.preventDefault();
    var $selected_input = $(evt.target).parent().find('input, textarea, select');
    $selected_input.trigger('focus');
  },

  engage_select_popover: function(evt) {
    evt.preventDefault();
    var guided_link = $(evt.target);
    guided_link.popover('show');

    function remove_popover_close_event() {
      document.removeEventListener('mouseup', close_popover_on_click_outside);
    };

    function close_popover_on_click_outside(evt) {
      if ($(evt.target).closest('.popover').length === 0) {
        if ($('.popover').is(':visible')) {
          guided_link.popover('toggle');
          remove_popover_close_event();
        }
      }
    };

    document.addEventListener('mouseup', close_popover_on_click_outside);
  },

  init_sticky: function() {
    var control = $(".record_controls_container, .index_controls_container"),
    stickem = control.sticky({
      topSpacing: control.data('top'),
      bottomSpacing: control.data('bottom')
    });

    nav_stickem = $('nav').sticky()
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

  show_hide_record_type: function($input) {
    var $inputs = $input ? $input : $('.record_types input:not([type="hidden"])');

    $inputs.each(function(k, v) {
      var $selected_input = $(v),
          section_finder_str = '.section' + '.' + $selected_input.val(),
          $id_section = $('.associated_form_ids').find(section_finder_str);

      $selected_input.is(":checked") ? $id_section.fadeIn(800) : $id_section.fadeOut(800);
    });
  },

  //Adding the case_id from which the GBV incident is being created.
  //GBV Case should hold list of GBV incidents created using this case.
  populate_case_and_incident_detail_id_for_incidents: function() {
    case_id = _primero.get_param("case_id");
    incident_detail_id = _primero.get_param("incident_detail_id");
    if (case_id) {
      $(".new-incident-form").prepend("<input id='incident_case_id' name='incident_case_id' type='hidden' value='" + case_id + "'>");
    }
    if (incident_detail_id) {
      $(".new-incident-form").prepend("<input id='incident_detail_id' name='incident_detail_id' type='hidden' value='" + incident_detail_id + "'>");
    }
  },

  submit_form: function(evt) {
    var $button = $(evt.target),
    //find out if the submit button is part of the form or not.
    //if not part will need to add the "commit" parameter to let it know
    //the controller what was triggered.
    $parent = $button.parents("form.default-form");

    if ($parent.length > 0) {
      //Just a regular submit in the form.
      $parent.submit();
    } else {
      //Because some design thing we need to add the "commit" parameter
      //to the form because the submit triggered is outside of the form.
      var $form = $('form.default-form'),
          $commit = $form.find("input[class='submit-outside-form']");

      if ($commit.length === 0) {
        $form.append("<input class='submit-outside-form' type='hidden' name='commit' value='" + $button.val() + "'/>");
      } else {
        $($commit).val($button.val());
      }

      $form.submit();
    }
  },

  disable_default_events: function(evt) {
    evt.preventDefault();
  },

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
          if (param === q_param[j] || param.indexOf(q_param[j]) === 0) {
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
    return $(form).find("#errorExplanation ul");
  },

  //create or clean the container errors messages: #errorExplanation.
  _primero_create_or_clean_error_messages_container: function(form) {
    var $form = $(form);
    if ($form.find("#errorExplanation").length === 0) {
      $form.find(".tab div.clearfix").each(function(x, el) {
        $(el).after("<div id='errorExplanation' class='errorExplanation'>" +
          "<h2>" + I18n.t('error_message.notice') + "</h2>" +
          "<p>" + I18n.t('error_message.fields_notice') + "</p>" +
          "<ul/>" +
          "</div>");
      });
    } else {
      //TODO If we are going to implement other javascript validation
      //     we must refactor this so don't lost the other errors messages.
      $form.find("#errorExplanation ul").text("");
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
    var $fieldset = input.parents('.summary_group');
    var $autosum_total_input = $fieldset.find('input.autosum_total[type="text"][autosum_group="' + autosum_group + '"]');
    $fieldset.find('input.autosum[type="text"][autosum_group="' + autosum_group + '"]').each(function(){
      var value = $(this).val();
      if(!isNaN(value) && value !== ""){
        autosum_total += parseFloat(value);
      }
    });
    $autosum_total_input.val(autosum_total);
  },

  // Returns the version of Internet Explorer or a -1
  // (indicating the use of another browser).
  _primero_getInternetExplorerVersion: function() {
    var rv = -1; // Return value assumes failure.
    if (navigator.appName == 'Microsoft Internet Explorer') {
      var ua = navigator.userAgent;
      var re  = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
      if (re.exec(ua) !== null) {
        rv = parseFloat( RegExp.$1 );
      }
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

  _primero_loading_screen_indicator: function(action, callback) {
    var $loading_screen = $('.loading-screen'),
        $body = $('body, html');

    switch(action) {
      case 'show':
        $loading_screen.show();
        $body.css('overflow', 'hidden');
        break;
      case 'hide':
        $loading_screen.hide();
        $body.css('overflow', 'visible');
        break;
    }

    if (callback) {
      setTimeout(function() {
        callback();
      }, 1000);
    }
  },

  _primero_show_add_violation_message: function() {
    $("fieldset[id$='_violation_wrapper'] .subforms").each(function(k, v) {
      var $elm = $(this),
          message = $(v).parent().prev('.add_violations_message');
      if ($elm.children().length <= 0 && !message.prev('.empty_violations').is(':visible')) {
        message.show();
      } else {
        message.hide();
      }
    });
  },

  _primero_serialize_object: function(obj, prefix) {
    var str = [];
    for(var p in obj) {
      if (obj.hasOwnProperty(p)) {
        var k = prefix ? prefix + "[" + p + "]" : p, v = obj[p];
        str.push(typeof v == "object" ?
          serialize(v, k) :
          encodeURIComponent(k) + "=" + encodeURIComponent(v));
      }
    }
    return str.join("&");
  },

  _primero_check_download_status: function(closure) {
    var download_cookie_name = 'download_status_finished',
      clock = setInterval(check_status, 2000);
    function check_status() {
      if (_primero.read_cookie(download_cookie_name)) {
        _primero.loading_screen_indicator('hide');
        _primero.remove_cookie(download_cookie_name);
        if (closure !== undefined && _.isFunction(closure)) {
          closure();
        }
        clearInterval(clock);
      }
    }
  },

  _primero_check_status_close_modal: function() {
    _primero.check_download_status(close_forms_export_modal_after_download);

    function close_forms_export_modal_after_download() {
      $('[id$=forms-export]').foundation('close');
    };
  },

  _primero_create_cookie: function(name, value, days) {
    var expires;

    if (days) {
      var date = new Date();
      date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
      expires = "; expires=" + date.toGMTString();
    } else {
      expires = "";
    }
    document.cookie = encodeURIComponent(name) + "=" + encodeURIComponent(value) + expires + "; path=/";
  },

  _primero_read_cookie: function(name) {
    var name_eq = encodeURIComponent(name) + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) === ' ') c = c.substring(1, c.length);
      if (c.indexOf(name_eq) === 0) return decodeURIComponent(c.substring(name_eq.length, c.length));
    }
    return null;
  },

  _primero_remove_cookie: function(name) {
    _primero.create_cookie(name, "", -1);
  },

  load_and_redirect: function() {
    if (window.disable_loading_indicator === undefined) {
      _primero.loading_screen_indicator('show');
    }
    window.disable_loading_indicator = undefined;

    if (_primero.getInternetExplorerVersion() > 0) {
      window.onbeforeunload = null;
    }
  },

  scrollTop: function() {
    window.scrollTo(0,0);
  },

  update_subform_heading: function(subformEl) {
    // get subform header for shared summary page
    var $subform_element = $(subformEl)
    var $subform = $subform_element.parent();
    var subform_index = $subform_element.data('subform_index');
    var $summary_subform = $('div[data-shared_subform="' + $subform.attr('id') + '"] div[data-subform_index="' + subform_index + '"]');
    var display_field = [];
    if ($summary_subform.length > 0) {
      display_field = $summary_subform.find(".collapse_expand_subform_header div.display_field span");
    }

    //Update the static text with the corresponding input value to shows the changes if any.
    $subform_element.find(".collapse_expand_subform_header div.display_field span").each(function(x, el){
      //view mode doesn't sent this attributes, there is no need to update the header.
      var data_types_attr = el.getAttribute("data-types"),
          data_fields_attr = el.getAttribute("data-fields"),
          //This is the i18n string for 'Caregiver'.
          data_caregiver_attr = el.getAttribute("data-caregiver");
      if (data_types_attr !== null && data_fields_attr != null) {
        //retrieves the fields to update the header.
        var data_types = data_types_attr.split(","),
            data_fields = data_fields_attr.split(","),
            values = [],
            caregiver = false;
        for (var i=0; (data_fields.length == data_types.length) && (i < data_fields.length); i++) {
          var input_id = data_fields[i],
              input_type = data_types[i],
              value = null;
          if (input_type == "chosen_type") {
            //reflect changes of the chosen.
            var $input = $subform_element.find("select[id='" + input_id + "_'] option:selected");
            if ($input.val() !== null) {
              var selected = $input.map(function() {
                return $(this).text();
              }).get().join(', ');
              value = selected;
            }
          } else if (input_type == "radio_button_type") {
            //reflect changes of the for radio buttons.
            var $input = $subform_element.find("input[id^='" + input_id + "']:checked");
            if ($input.size() > 0) {
              value = $input.val();
            }
          } else if (input_type == "tick_box_type") {
            var $input = $subform_element.find("#" + input_id + ":checked");
            value = $input.size() == 1;
          }else if (input_type == "select_box_type") {
            var $input = $subform_element.find("#" + input_id + " option:selected");
            if ($input.html() !== "" && $input.html() !== "(Select...)") {
              value = $input.html();
            }
          } else {
            //Probably there is other widget that should be manage differently.
            var $input = $subform_element.find("#" + input_id);
            if ($input.val() !== "") {
              value = $input.val();
            }
          }

          if (value !== null) {
            //Don't see the way to do this without hardcode the name.
            //Users can change the dbname for this field.
            if (input_id.match(/relation_is_caregiver$/)) {
              //Is the family member the caregiver?
              caregiver = value;
            } else {
              values.push(value);
            }
          }
        }

        var display_text = values.join(" - ");
        if (caregiver) {
          //Add 'Caregiver' string to the end of the header.
          //data_caregiver_attr is supposed to be a i18n string.
          display_text = display_text + data_caregiver_attr;
        }
        $(el).text(display_text);
        if (display_field.length > 0) {
          display_field.text(display_text);
        }
      }
    });
  },

  abide_validator_date_not_future: function($el, required, parent) {
    if (!required && !$el.val()) return true;
    if ($el && $el.attr('disabled') !== "disabled") {
      return _primero.valid_datepicker_value($el.val(), required) && _primero.date_not_future($el.val(), required);
    } else {
      //Don't validate disabled inputs, browser does not send anyway.
      return true;
    }
  },

  date_not_future: function(value, required) {
    if (value !== "") {
      try {
          var date = _primero.dates.parseDate(value);
          return date < Date.now();
      } catch(e) {
          console.error("An error occurs parsing date value." + e);
          return false;
      }
    } else {
      //If value is empty check if required or not.
      return !required;
    }
  },

  abide_validator_date: function($el, required, parent) {
    if (!required && !$el.val()) return true;
    if ($el && $el.attr("disabled") !== "disabled") {
      return _primero.valid_datepicker_value($el.val(), required);
    } else {
      //Don't validate disabled inputs, browser does not send anyway.
      return true;
    }
  },

  valid_datepicker_value: function(value, required) {
    if (value !== "") {
      try {
          var date = _primero.dates.parseDate(value);
          return date !== null && date !== undefined;
      } catch(e) {
          console.error("An error occurs parsing date value." + e);
          return false;
      }
    } else {
      //If value is empty check if required or not.
      return !required;
    }
  },

  abide_validator_positive_number: function($el, required, parent) {
    if (!required && !$el.val()) return true;
    if ($el && $el.attr("disabled") !== "disabled") {
      return _primero.valid_positive_number_value($el.val(), required);
    } else {
      return true;
    }
  },

  valid_positive_number_value: function(value, required) {
    if (value !== "") {
      return !isNaN(value) && value >= 0;
    } else {
      return !required;
    }
  },

  clear_modal_form: function(e) {
    var form = $(e.target).find('form')[0]

    if (form) {
      form.reset();
    }
  },

  generate_download_link: function(url) {
    var download_link = document.createElement("a");
    download_link.href = url;
    download_link.setAttribute('data-turbolinks', false);
    document.body.appendChild(download_link);
    download_link.click();
    document.body.removeChild(download_link);
    this._primero_loading_screen_indicator('hide');
  }
});
