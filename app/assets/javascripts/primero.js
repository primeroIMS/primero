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

$(document).ready(function() {
  $('.btn_submit').on('click', function() {
    $('form.default-form').submit();
  });

  var stickem = $(".record_controls_container").sticky({ 
    topSpacing: 50,
    bottomSpacing: 40 
  });
  
  $(".filter-chosen").chosen();

  stickem.on('sticky-start', function() { $(this).addClass('sticking') });
  stickem.on('sticky-end', function() { $(this).removeClass('sticking')  });
});