
Primero.PasswordPrompt = (function() {
    var passwordDialog = null, targetEl = null, passwordEl = null;

    return {
        initialize: function() {
            passwordDialog = $("#password-prompt-dialog").dialog({
                autoOpen: false,
                modal: true,
                resizable: false,
                buttons: {
                    "OK" : function() {
                        var password = passwordEl.val();
                        var errorDiv = $("div#password-prompt-dialog .flash");
                        if (password == null || password == undefined || password.trim() == "") {
                            errorDiv.children(".error").text(I18n.t("encrypt.password_mandatory")).css('color', 'red');
                            errorDiv.show();
                            return false;
                        } else {
                            errorDiv.hide();
                            Primero.PasswordPrompt.updateTarget();
                        }
                    }
                },
               close: function(){
                   $("div#password-prompt-dialog .flash .error").text("");
               }

            });
            passwordEl = $("#password-prompt-field");
            $(".password-prompt").each(Primero.PasswordPrompt.initializeTarget);
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
                    passwordDialog.dialog("open");
                    return false;
                }
            });
        },

        updateTarget: function() {
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
                window.location = href;
            } else if (targetType == "input") {
                targetEl.closest("form").find("#hidden-password-field").val(password);
                targetEl.trigger("click");
            }
        }
    }
}) ();

$(function() {
  Primero.PasswordPrompt.initialize();
});

