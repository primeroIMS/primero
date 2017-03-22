var PasswordPromptModel = Backbone.Model.extend({
  mapForm: function(formData) {
    var data = {}
    
    _.map(formData, function(n, i)  {
      data[n.name] = n.value
    });

    this.set(data)
  },
});

_primero.Views.PasswordPrompt = _primero.Views.Base.extend({
  el: 'body',

  events: {
    'click .password-prompt': 'openModal',
    'click #password-prompt-dialog form button[type="submit"]': 'submitRequest',
  },
  
  initialize: function() {
    var self = this;

    this.model = new PasswordPromptModel();
    this.modal = $('#password-prompt-dialog');
    this.form = this.modal.find('form');

    this.create_password_field();

    this.modal.on('closed.zf.reveal', function() {
      self.cleanup();
    });
  },

  openModal: function(e) {
    e.preventDefault();

    this.target = e.target
    this.targetType = e.target.tagName.toLowerCase();
    this.modal.foundation('open');
  },

  alert: function(action) {
    var alert = this.modal.find('.alert');
    action === 'show' ? alert.show() : alert.hide();
  },
  
  submitRequest: function(e) {
    e.preventDefault();

    this.alert('hide');
    this.model.mapForm(this.form.serializeArray())

    if (this.model.get('password-prompt-field')) {
      this.alert('hide');
      this.processRequest();
    } else {
      this.alert('show');
    }
  },

  processRequest: function(data) {
    var password = this.model.get('password-prompt-field');
    var fileName = this.model.get('export-file-name')

    if (this.targetType === "a") {
      var href = this.target.href;
      var selected_records = "";

      $('input.select_record:checked').each(function(){
          selected_records += $(this).val() + ",";
      });

      href += (href.indexOf("?") == -1 ? "?" : "") + "&password=" + password + "&selected_records=" + selected_records;

      //Add the file name for the exported file if the user provided one.
      if (fileName != "") {
        href += "&custom_export_file_name=" + fileName;
      }
      
      this.cleanup();

      _primero.check_download_status();
      
      window.location = href;
    } else if (this.targetType === "input") {
      $(this.target).closest("form").find("#hidden-password-field").val(password);
      $(this.target).trigger("click");
    }
  }, 

  cleanup: function() {
    this.form[0].reset();
    this.model.clear();
    this.modal.foundation('close')
  },

  //Hack: In order to prevent the browser allow the user save password we are using the MaskedPassword
  //which create a hidden field that is supposed to hold the value of the password.
  //So, we tried to reach the hidden field first other than that we reach the regular field.
  create_password_field: function() {
    //Create the hidden field for the password.
    var passEL = $("#password-prompt-field");
    if (passEL.length > 0) {
      return new MaskedPassword(passEL.get(0));
    }
    return null;
  },
});