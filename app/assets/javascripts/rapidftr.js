var RapidFTR = {};

RapidFTR.maintabControl = function(){
    var currentURL = window.location.href;
    var module = currentURL.split("/");
    var moduleName = module[3];
    switch (moduleName)
    {
        case "children" : $(".main_bar li a:contains('CHILDREN')").addClass("sel");
        break;

        case "formsections" : $(".main_bar li a:contains('FORMS')").addClass("sel");
        break;

        case "users":
        case "roles":   $(".main_bar li a:contains('USERS')").addClass("sel");
        break;

        case "devices":   $(".main_bar li a:contains('DEVICES')").addClass("sel");
        break;
    }


}

RapidFTR.enableSubmitLinks = function() {
  $(".submit-form").click(function() {
    var formToSubmit = $(this).attr("href");
    $(formToSubmit).submit();
    return false;
  });
}

RapidFTR.activateToggleFormSectionLinks = function() {
  var toggleFormSection = function(action, message) {
    return function() {
            if(!$('#form_sections input:checked').length) {
                alert(I18n.t("messages.show_hide_forms"));
            }
                else if(confirm(message)) {
    		    $("#enable_or_disable_form_section").attr("action", "form_section/" + action).submit();
    		return true;
			} else {
				return false;
			}
    };
  }

  $("#enable_form").click(toggleFormSection("enable", I18n.t("messages.show_forms")));
  $("#disable_form").click(toggleFormSection("disable", I18n.t("messages.hide_forms")));
}


RapidFTR.hideDirectionalButtons = function() {
  $("#formFields .up-link:first").hide();
  $("#formFields .down-link:last").hide();
}

RapidFTR.followTextFieldControl = function(selector, followSelector, transformFunction) {
  $(selector).keyup(function() {
    var val = $(this).val();
    var transformed = transformFunction(val);
    $(followSelector).val(transformed);
  });
}

RapidFTR.childPhotoRotation = {
    rotateClockwise: function(event) {
        RapidFTR.childPhotoRotation.childPicture().rotateRight(90, 'rel');
        self.photoOrientation.val((parseInt(self.photoOrientation.val()) + 90) % 360);
        event.preventDefault();
    },

    rotateAntiClockwise: function(event) {
        RapidFTR.childPhotoRotation.childPicture().rotateLeft(90, 'rel');
        self.photoOrientation.val((parseInt(self.photoOrientation.val()) - 90) % 360);
        event.preventDefault();
    },

    restoreOrientation: function(event) {
        RapidFTR.childPhotoRotation.childPicture().rotate(0, 'abs');
        self.photoOrientation.val(0);
        event.preventDefault();
    },

    childPicture : function(){
        return $("#child_picture");
    },

    init: function() {
        var WAITING_TIME = 250;
        self.photoOrientation = $("#child_photo_orientation");
        $("#image_rotation_links .rotate_clockwise").click(this.rotateClockwise);
        $("#image_rotation_links .rotate_anti_clockwise").click(this.rotateAntiClockwise);

        var restore_image_button = $("#image_rotation_links .restore_image")
        restore_image_button.click(this.restoreOrientation);
        if ($.browser.webkit){
            restore_image_button.click();
            setTimeout(function(){
                restore_image_button.click()
            }, WAITING_TIME);
        }
    }
};

RapidFTR.showDropdown = function(){
    $('html').click(function(event){
        //Inspect if the click event was triggered or not
        //by a datepicker widget, we don't want to close
        //the flag form in this case.
        var el = $(event.target),
            parent = el.parents(".ui-datepicker");
        if (parent.length == 0) {

            // $(".dropdown").children().each(function() {
            //     if ($(this).is('form')) {
            //         $(this).remove();
            //     }
            // });
            // $(".dropdown").hide();
        }
    });
};

RapidFTR.Utils = {
    dehumanize: function(val){
        return jQuery.trim(val.toString()).replace(/\s/g, "_").replace(/\W/g, "").toLowerCase();
    },

    enableFormErrorChecking: function() {
        $('.dropdown').delegate(".mark-as-submit", 'click', function(){
            if($(this).parents("form").find("input.flag_message").val()==""){
                alert($(this).attr('data-error-message'));
                return false;
            }
        });
    }
};

//TODO: No longer used. Delete.
RapidFTR.validateSearch = function() {
  var query = $("#query").val();
  if (query == undefined || query == null || query.toString().trim() == "") {
    alert("Please enter a search query");
    return false;
  }

  return true;
};

function on_page_load() {
  _primero = $.extend(RapidFTR, _primero);
  RapidFTR.maintabControl();
  RapidFTR.enableSubmitLinks();
  RapidFTR.activateToggleFormSectionLinks();
  RapidFTR.hideDirectionalButtons();
  RapidFTR.followTextFieldControl("#field_display_name", "#field_name", RapidFTR.Utils.dehumanize);
  RapidFTR.childPhotoRotation.init();
  if (window.location.href.indexOf('login') === -1) {
      IdleSessionTimeout.start();
  }

  RapidFTR.Utils.enableFormErrorChecking();
  RapidFTR.showDropdown();
  //Initialize chosen in the current tab. There is a chance that
  //the element we get is a group, if that is the case we need to
  //lookup inside the group to find what is really the current tab.
  var group_or_tab = $(".tab-handles li.current:eq(0)");
  var current_tab = null;
  if ($(group_or_tab).hasClass("group")) {
    //If the element is a group tab, find in his children
    //the current tab.
    current_tab = $(group_or_tab).find("li.current a").attr("href");
  } else {
    //If is not group tab, find the anchor child directly.
    current_tab = $(group_or_tab).find("a").attr("href");
  }
  _primero.chosen(current_tab + ' select.chosen-select:visible');
}
$(on_page_load);
