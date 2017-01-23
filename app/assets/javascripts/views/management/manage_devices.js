function manage_devices() {
  $(".device_blacklist_check_box").click(function (event) {
    setModalText();
    var _this = this;
    var $this = $(this);
    var $modal_dialog = $("#modal-dialog");
    var dialog_buttons = {};
    dialog_buttons[I18n.t("yes_label")] = function () {
      $this.dialog('close');updateBlackListFlag(_this);
    };
    dialog_buttons[I18n.t("cancel")] = function () {
      $this.dialog('close');
    };
    $modal_dialog.dialog({
      modal: true,
      width: 400,
      title: I18n.t("device.blacklist"),
      height: 200,
      buttons: dialog_buttons
    });
    $modal_dialog.dialog("open");
    event.preventDefault();
  })
};

function updateBlackListFlag(check_box) {
  var $checkbox = $(".device_blacklist_check_box");
  var $check_box = $(check_box);
  $.ajax({
    url: "/devices/update_blacklist",
    type: "POST",
    dataType: 'json',
    data: {
      blacklisted: !($check_box.is(':checked')),
      imei: $check_box.attr('id')
    },
    success:function (json) {
      if (json.status == 'ok') {
        location.reload();
      }
    }
  });
}

function setModalText() {
  var $modal_dialog = $("#modal-dialog");
  var next_state__as_checked = $(".device_blacklist_check_box").is(':checked');
  if (next_state__as_checked) {
    $modal_dialog.text(I18n.t("device.messages.blacklist"));
  } else {
    $modal_dialog.text(I18n.t("device.messages.remove_blacklist"));
  }
}

$(manage_devices);
