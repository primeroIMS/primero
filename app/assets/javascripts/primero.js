// TODO: refactor into Primero when refactoring filters behavior - JT
_primero.clean_page_params = function(q_param) {
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
};

_primero.get_param = function(param) {
  var query = window.location.search.substring(1);
  var params = query.split("&");
  for (var i=0; i< params.length; i++) {
    var key_val = params[i].split("=");
    if(key_val[0] == param){
      return key_val[1];
    }
    if(key_val[0].indexOf(param) === 0) {
      return key_val[0] + ':' + key_val[1]
    }
  }
  return false;
};

//Create the <li /> item to the corresponding error messages.
//message: message to show.
//tab: tab where the element that generate the error exists.
_primero.generate_error_message = function(message, tab) {
  return "<li data-error-item='" + $(tab).attr("id") + "' class='error-item'>"
         + message
         + "</li>";
};

//Find the container errors messages.
_primero.find_error_messages_container = function(form) {
  return $(form).find("div#errorExplanation ul");
};

//create or clean the container errors messages: div#errorExplanation.
_primero.create_or_clean_error_messages_container = function(form) {
  if ($(form).find("div#errorExplanation").length == 0) {
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
};

_primero.object_to_params = function(filters) {
  var url_string = "";
  for (var key in filters) {
    if (url_string !==  "") {
      url_string += "&";
    }
    url_string += "scope[" + key + "]" + "=" + filters[key].join("||");
  }
  return url_string;
};

_primero.filters = {};

_primero.update_autosum_field = function(input) {
  var autosum_total = 0;
  var autosum_group = input.attr('autosum_group');
  var fieldset = input.parents('.summary_group');
  var autosum_total_input = fieldset.find('input.autosum_total[type="text"][autosum_group="' + autosum_group + '"]');
  fieldset.find('input.autosum[type="text"][autosum_group="' + autosum_group + '"]').each(function(){
    var value = $(this).val();
    if(!isNaN(value) && value != ""){
      autosum_total += parseFloat(value);
    }
  });
  autosum_total_input.val(autosum_total);
}

var Primero = Backbone.View.extend({
  el: 'body',

  events: {
    'click .btn_submit': 'submit_form',
    'click .gq_popovers': 'engage_popover',
    'sticky-start .record_controls_container, .index_controls_container': 'start_sticky',
    'sticky-end .record_controls_container, .index_controls_container': 'end_sticky',
    'click .action_btn': 'disable_default_events'
  },

  initialize: function() {
    this.init_sticky();
    this.init_popovers();
    this.init_autogrow();
    this.init_action_menu();
    this.init_chosen_or_new();
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
    $(evt.target).addClass('sticking')
  },

  end_sticky: function(evt) {
    $(evt.target).removeClass('sticking')
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

      if (commit.length == 0) {
        form.append("<input class='submit-outside-form' type='hidden' name='commit' value='" + button.val() + "'/>")
      } else {
        $(commit).val(button.val());
      }

      form.submit();
    }
    _primero.set_content_sidebar_equality();
  },

  disable_default_events: function(evt) {
    evt.preventDefault();
  }
});

$(document).ready(function() {
  new Primero();
});
