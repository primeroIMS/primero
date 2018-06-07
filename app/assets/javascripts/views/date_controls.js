_primero.Views.DateControl = _primero.Views.Base.extend({
  el: 'body',

  allowed_formats: [
    "DD-MM-YYYY",
    "DD/MM/YYYY",
    "DD MM YYYY",
    "DD-MMM-YYYY",
    "DD/MMM/YYYY",
    "DD-MM-YYYY H:mm",
    "DD/MM/YYYY H:mm",
    "DD MM YYYY H:mm",
    "DD-MMM-YYYY H:mm",
    "DD/MMM/YYYY H:mm",
  ],

  events: {
    'focus .form_date_field': 'init_date_field',
    'change .form_date_field': 'format_date_input'
  },

  init_date_field: function(e) {
    var control = $(e.target);
    var self = this;

    if (!control.data('datepicker')) {
      var options = _.extend(_primero.dates.options,  {
        onHide: function() {
          if (self.is_mobile) {
            control.parents('.reveal-overlay').off('scroll')
          }
        }
      })

      control.datepicker(options);

      if (this.is_mobile) {
        control.parents('.reveal-overlay').on('scroll', function () {
          control.data('datepicker').update()
        });
      }
    }
  },

  initialize: function() {
    var self = this;
    this.create_locales();
    this.setup_date_parser();

    this.is_mobile = /(android)/i.test(navigator.userAgent);

    _primero.dates.options = {
      language: I18n.currentLocale(),
      position: this.is_mobile ? 'top left' : 'bottom left',
      todayButton: new Date(),
      dateFormat: "dd-M-yyyy",
      clearButton: true,
      autoClose: true,
      toggleSelected: false,
      onSelect: function(formattedDate, date, inst) {
        $(inst.el).trigger('change');
      }
    };

    if ($('html').attr('dir') === 'rtl') {
      _primero.dates.options['position'] = 'bottom right';
    }

    this.date_control = $('.form_date_field');

    dispatcher.on('CloseView', this.destroy_datepicker, this);
  },

  destroy_datepicker: function() {
    _.each(this.date_control, function(control) {
      var control_instance = $(control).data('datepicker');

      if (control_instance) {
        control_instance.destroy();
      }
    });
  },

  create_locales: function() {
    var dateI18n = I18n.lookup('date');

    $.fn.datepicker.language[I18n.currentLocale()] = {
      days: dateI18n.day_names,
      daysShort: dateI18n.abbr_month_names,
      daysMin: dateI18n.abbr_day_names_short,
      months: _.compact(dateI18n.month_names),
      monthsShort: _.compact(dateI18n.abbr_month_names),
      today: dateI18n.today,
      clear: dateI18n.clear,
      firstDay: dateI18n.first_day || 0,
    };

    moment.locale(I18n.currentLocale(), {
      monthsShort: _.compact(I18n.lookup('date').abbr_month_names),
      monthsParseExact : true
    });
  },

  setup_date_parser: function() {
    _primero.dates = {};
    _primero.dates.defaultDateFormat = 'DD-MMM-YYYY';
    _primero.dates.defaultDateTimeFormat = 'DD-MMM-YYYY H:mm'
    _primero.dates.inputFormats = this.allowed_formats;

    _primero.dates.parseDate = function(value) {
      var date = moment(value, _primero.dates.inputFormats, I18n.currentLocale(), true).toDate();
      return date === 'Invalid date' ? undefined : date;
    }

    _primero.dates.formatDate = function(value, time) {
      var format = time ? 'defaultDateTimeFormat' : 'defaultDateFormat';
      var date = moment(value).format(_primero.dates[format]);
      return date === 'Invalid date' ? undefined : date;
    }
  },

  format_date_input: function(event) {
    var $control = $(event.target);
    var date = _primero.dates.parseDate($control.val());

    if (date != undefined && date != null) {
      has_time = $control.data('timepicker')
      $control.val(_primero.dates.formatDate(date, has_time));
    }
  }
});