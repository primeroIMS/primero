_primero.Views.DateRangeValidation = Backbone.View.extend({
  el: '.page_content .data-form',

  events: {
    'submit' : 'validate'
  },

  validate: function(event) {
    var self = this;
    var errors_messages = [];
    var target = event.target || event.srcElement;

    $(target).find(".date_or_date_range_selector input[type='radio'][value='date_range']:checked").each(function(x, el){
      //Use the radio button name to infer the date range fields.
      var name_from = $(el).attr("name").replace(/date_or_date_range\]$/, "from]");
      var name_to = $(el).attr("name").replace(/date_or_date_range\]$/, "to]");
      var date_from = $(el).parent().parent().find("input[name='" + name_from + "']");
      var date_to = $(el).parent().parent().find("input[name='" + name_to + "']");
      //Parse the values.
      var date_from_date = $.datepicker.parseDate($.datepicker.defaultDateFormat, date_from.val());
      var date_to_date = $.datepicker.parseDate($.datepicker.defaultDateFormat, date_to.val());

      //Allow null values for both, but validate if at least one is there.
      if ((date_from_date == null && date_to_date != null) || (date_from_date != null && date_to_date == null) || (date_from_date > date_to_date)) {
        errors_messages.push(_primero.generate_error_message($(date_from).parent().attr("data-on-errors"), $(date_from).parents(".tab")));
      }
    });
    if (errors_messages.length > 0) {
      //TODO what if implement other javascript validation, we must don't delete the container?
      _primero.create_or_clean_error_messages_container(target);
      var $container = _primero.find_error_messages_container(target);
      $container.append(errors_messages.join(''));
    }
    return errors_messages.length == 0;
  },

});