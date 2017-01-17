_primero.Views.PasswordPrompt = (function() {
    var passwordDialog = null, targetEl = null, passwordEl = null, fileNameEl = null;

    return {
        initialize: function() {
            passwordDialog = $("#password-prompt-dialog").dialog({
                autoOpen: false,
                modal: true,
                resizable: false,
                buttons: {
                    "OK" : function() {
                        var password = passwordEl ? passwordEl.val() : null;
                        var errorDiv = $("div#password-prompt-dialog .flash");
                        if (password == null || password == undefined || password.trim() == "") {
                            errorDiv.children(".error").text(I18n.t("encrypt.password_mandatory")).css('color', 'red');
                            errorDiv.show();
                            return false;
                        } else {
                            errorDiv.hide();
                            _primero.Views.PasswordPrompt.updateTarget();
                        }
                    }
                },
               close: function(){
                   $("div#password-prompt-dialog .flash .error").text("");
                   $("div#password-prompt-dialog .flash").hide();
               }

            });
            passwordEl = _primero.Views.PasswordPrompt._create_password_field();
            fileNameEl = $("#export-file-name-field");
            $(".password-prompt").each(_primero.Views.PasswordPrompt.initializeTarget);
        },

        initializeTarget: function() {
            var self = $(this), targetType = self.prop("tagName").toLowerCase();
            $("div#password-prompt-dialog .flash .error").text("");

            if (targetType == "a") {
                self.data("original-href", self.attr("href"));
            }

            self.click(function(e) {
                if (e["isTrigger"] && e["isTrigger"] == true) {
                    return true;
                } else {
                    targetEl = $(this);
                    passwordEl.val("");
                    fileNameEl.val("");
                    passwordDialog.dialog("open");
                    return false;
                }
            });
        },

        updateTarget: function() {
            var fileName = fileNameEl.val();
            var password = passwordEl.val();
            var targetType = targetEl.prop("tagName").toLowerCase();

            passwordEl.val("");
            passwordDialog.dialog("close");

            if (targetType == "a") {
                var href = targetEl.data("original-href"),
                    selected_records = "";
                $('input.select_record:checked').each(function(){
                    selected_records += $(this).val() + ",";
                });
                href += (href.indexOf("?") == -1 ? "?" : "") + "&password=" + password + "&selected_records=" + selected_records;
                //Add the file name for the exported file if the user provided one.
                if (fileName != "") {
                  href += "&custom_export_file_name=" + fileName;
                }
                _primero.check_download_status();
                window.location = href;
            } else if (targetType == "input") {
                targetEl.closest("form").find("#hidden-password-field").val(password);
                targetEl.trigger("click");
            }
        },

        //Hack: In order to prevent the browser allow the user save password we are using the MaskedPassword
        //which create a hidden field that is supposed to hold the value of the password.
        //So, we tried to reach the hidden field first other than that we reach the regular field.
        _create_password_field: function() {
          //Create the hidden field for the password.
          var passEL = $("#password-prompt-field");
          if (passEL.length > 0) {
            return new MaskedPassword(passEL.get(0));
          }
          return null;
        },
    }
}) ();

