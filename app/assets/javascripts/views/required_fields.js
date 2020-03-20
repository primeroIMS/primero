_primero.Views.RequiredFields = _primero.Views.Base.extend({
  el: 'body',

  events: {
    "invalid.zf.abide form": "hide_indicator",
    "forminvalid.zf.abide form": "show_errors"
  },

  hide_indicator: function() {
    _primero.loading_screen_indicator('hide');
  },

  show_errors: function(e) {
    var self = this,
      $invalid_fields = $(e.target).find('[data-invalid]'),
      error_container = JST['templates/form_error_message'],
      errors = [];
      prev_label = '';

    $('.errorExplanation').remove();
    $('.side-tab a span.label').remove();

    _.each($invalid_fields, function(field) {
      var $field = $(field);
      var $fieldset = $field.parents('fieldset.tab'),
        group = $fieldset.data('form-section-group-id'),
        form = $fieldset.data('form-name'),
        required_text = _primero.form_error_messages.required,
        label = $("label[for='" + $field.attr('id') + "']:first").text(),
        has_group = group ? group + " - " : "",
        message = "<li><span>" + has_group + form + " " + "</span><span>" + label + "</span>" +  " " + required_text + "</li>";

      if (prev_label != label) {
        errors.push(message);
      }

      if (group && prev_label != label) {
        self.show_tab_errors(group);
      }

      if (form && prev_label != label) {
        self.show_tab_errors(form);
      }

      prev_label = label;

    });

    if (errors.length > 0) {
      $('.side-tab-content').prepend(error_container({errors: errors}));
      //Reflow equalizer
      var $new_page = $('.page-content-new');
      if($new_page.length > 0) {
        var elem = new Foundation.Equalizer($new_page);
        elem.applyHeight();
      }
    }
  },

  show_tab_errors: function(tab) {
    var anchor = $('.side-tab a').filter(function(){
      var re = new RegExp("^" + tab + "\\d*$");
      return $(this).text().match(re);
    });
    var $jewel = anchor.find('.label');
    var $jewel_container = $('<span class="label alert"></span>');

    if ($jewel.length > 0) {
      var count = parseInt($jewel.html());
      count++
      $jewel.html(count);
    } else {
      anchor.append($jewel_container.html(1));
    }
  }
});
