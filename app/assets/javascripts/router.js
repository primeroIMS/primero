_primero.Router = Backbone.Router.extend({
  routes: {
    'cases/new': '',
    'incidents/new': 'incidentRecordForm',
    'incidents/:id/edit': 'incidentRecordForm',
    'tracing_requests/new': '',
    'cases/:id': 'recordShowPage',
    'incidents/:id': 'incidentShowPage',
    'tracing_requests/:id': 'recordShowPage',
    'incidents': 'recordIndexPage',
    'cases': 'recordIndexPage',
    'tracing_requests': 'recordIndexPage',
    'children/:id': 'recordShowPage',
    'reports/new': 'reportsForm',
    'reports/:id/edit': 'reportsForm',
    'reports': 'reports',
    'reports/:id': 'reports',
    'lookups/new': 'lookups',
    'lookups/:id/edit': 'lookups',
    'users': 'passwordPrompt'
  },

  initialize: function() {
    this.formControls();
    new _primero.Views.tabNavigation();

    if (this.hasForm()) {
      this.recordForms();
    }
  },

  lookups: function() {
    new _primero.Views.LookupValueView();
  },

  passwordPrompt: function() {
    _primero.Views.PasswordPrompt.initialize();
  },

  recordActions: function() {
    this.passwordPrompt();
    new _primero.Views.CustomExports();
    new _primero.Views.PdfExports();
    new _primero.Views.ReferRecords();
    new _primero.Views.TransferRecords();
    new _primero.Views.FlagChild();
    new _primero.Views.FlagRecord();
    new _primero.Views.MarkForMobile();
  },

  recordIndexPage: function() {
    this.initIndexTable();
    this.recordActions();
    new _primero.Views.IndexFilters();
  },

  recordShowPage: function() {
    this.initIndexTable();
    this.recordActions();
    this.initAudio();
    this.subforms();
    new _primero.Views.Actions();
  },

  incidentShowPage: function() {
    this.recordShowPage();
    new _primero.Views.SummaryPage();
    this.incidentRecordForm()
  },

  formControls: function() {
    if ($('form:not("#search_form")').length > 0) {
      new _primero.Views.DateControl();
    }
  },

  recordForms: function() {
    this.recordActions();

    if ($('form:not("#search_form")').length > 0) {
      _primero.shared_fields = new _primero.Views.SharedFields();
      new _primero.Views.AutosumFields();
      new _primero.Views.AutoCalculateAgeDOB();
      new _primero.Views.DateRangeControl();
      new _primero.Views.DateRangeValidation();
      new _primero.Views.HiddenTextField();
      new _primero.Views.TickBoxField();
      new _primero.Views.FileUploadField();
      this.initAudio();
      this.subforms();
    }
  },

  subforms: function() {
    new  _primero.Views.SubformView();
  },

  incidentRecordForm: function() {
    new _primero.Views.ViolationListReload();
    new _primero.Views.SummaryPage();
  },

  reportsForm: function() {
    this.initIndexTable();
    new _primero.Views.ReportForm();
  },

  reports: function() {
    this.initIndexTable();
    new _primero.Views.ReportTable();
  },

  initAudio: function() {
    new _primero.Views.PhotoAudioFields();
  },

  initIndexTable: function() {
    _primero.indexTable = new _primero.Views.IndexTable();
  },

  hasForm: function() {
    return $('.data-form').length > 0 ? true : false
  }
});