_primero.Router = Backbone.Router.extend({
  routes: {
    '': 'dashboard',
    'cases/new': '',
    'incidents/new': 'incidentRecordForm',
    'incidents/:id/edit': 'incidentRecordForm',
    'tracing_requests/new': '',
    'incidents/:id': 'incidentShowPage',
    'tracing_requests/:id': 'recordShowPage',
    'incidents': 'recordIndexPage',
    'cases': 'recordIndexPage',
    'tracing_requests': 'recordIndexPage',
    'potential_matches': 'recordIndexPage',
    'duplicates': 'recordIndexPage',
    'audit_logs': 'recordIndexPage',
    'children/:id': 'recordShowPage',
    'reports/new': 'reportsForm',
    'reports/:id/edit': 'reportsForm',
    'reports': 'reports',
    'reports/:id': 'reports',
    'bulk_exports': 'bulk_exports',
    'tasks': 'tasks',
    'lookups/new': 'lookups',
    'lookups/:id/edit': 'lookups',
    'forms/:id/edit': 'formSectionEditPage',
    'forms/:form_section_id/fields/:id/edit': 'fieldEditPage',
    'users': 'usersPage',
    'users/new': 'userCreatePage',
    'users/:id/edit': 'userCreatePage',
    'users/:id': 'userCreatePage',
    'roles': 'roleIndexPage',
    'login' : 'maskedUserAndPasswordLogin',
    'sessions/new': 'maskedUserAndPasswordLogin',
    'locations/new': 'locations',
    'locations/:id/edit': 'locations',
    'matching_configurations/:id/edit': 'matchingConfigurationPage',
    'agencies/:id/edit':'agencyForm',
    'agencies/new':'agencyForm',
    'agencies/:id':'agencyForm',
    'agencies':'recordIndexPage',
    'user_groups':'recordIndexPage'
  },

  initialize: function() {
    this.formControls();
    new _primero.Views.LangToggle();
    new _primero.Views.tabNavigation();
    new _primero.Views.Connectivity();

    if (this.hasForm()) {
      this.recordForms();
    }

    //Cases show pages.
    //The Original expression (cases/:id and children/:id)
    //match the show page and the edit page:
    //  cases/ff72ddc52b33be0650f91071207c5eb0
    //  cases/ff72ddc52b33be0650f91071207c5eb0/edit?follow=true
    //avoid to match both pages.
    this.route(/(cases|children)\/([0-9|a-f|A-F])+(\?([\s\S]*))?$/, 'recordShowPage');
  },

  dashboard: function() {
    new _primero.Views.Dashboard();
    new _primero.Views.PopulateReportingLocationSelectBoxes();
    _primero.chosen("select.chosen-select");
  },

  lookups: function() {
    new _primero.Views.LookupValueView();
  },

  usersPage: function() {
    this.initIndexTable();
    new _primero.Views.IndexFilters();
    this.passwordPrompt();
    //When a validation fails users edit page goes to this url.
    this.userCreatePage();
  },

  passwordPrompt: function() {
    new _primero.Views.PasswordPrompt();
  },

  recordActions: function() {
    this.passwordPrompt();
    new _primero.Views.CustomExports();
    new _primero.Views.PdfExports();
    new _primero.Views.PopulateUserSelectBoxes();
    new _primero.Views.PopulateAgencySelectBoxes();
    new _primero.Views.ReferRecords();
    new _primero.Views.Notes();
    new _primero.Views.ReassignRecords();
    new _primero.Views.TransferRecords();
    new _primero.Views.FlagChild();
    new _primero.Views.FlagRecord();
    new _primero.Views.MarkForMobile();
    new _primero.Views.IncidentFromCase();
    new _primero.Views.IncidentDetailsFromCase();
  },

  recordIndexPage: function() {
    this.initIndexTable();
    this.recordActions();
    new _primero.Views.AutoCalculateAgeDOB()
    new _primero.Views.PopulateSelectBoxes();
    new _primero.Views.PopulateLocationSelectBoxes();
    new _primero.Views.PopulateReportingLocationSelectBoxes();
    new _primero.Views.IndexFilters();
    new _primero.Views.SaveFilters();
    this.maskedUserAndPasswordReferal();
    this.maskedUserAndPasswordTransfer();


    if ($('#ids-search')) {
      new _primero.Views.viewRecord();
      new _primero.Views.IdSearch();
    }
  },

  userCreatePage: function() {
    new _primero.Views.RequiredFields();
    new _primero.Views.PopulateSelectBoxes();
    new _primero.Views.PopulateLocationSelectBoxes();
    _primero.chosen(".default-form select.chosen-select");
  },

  recordShowPage: function() {
    //Because the way the controller render the edit page after some error
    //the router is matching as the show page because the url is changed
    //when enter to edit cases/ff72ddc52b33be0650f91071207c5eb0/edit?follow=true
    //after some error cases/ff72ddc52b33be0650f91071207c5eb0, but still the edit page.
    //The workaround is to ask if there is the data-form in the page, that way we try
    //to figure out is the edit page.
    if (!this.hasForm()) {
      this.initIndexTable();
      this.recordActions();
      this.initAudio();
      this.subforms();
      new _primero.Views.ApproveCasePlan();
      new _primero.Views.Actions();
      new _primero.Views.ReopenCase();
      new _primero.Views.RequestApproval();
      new _primero.Views.PopulateSelectBoxes();
      new _primero.Views.PopulateLocationSelectBoxes();
      new _primero.Views.PopulateReportingLocationSelectBoxes();
      this.maskedUserAndPasswordReferal();
      this.maskedUserAndPasswordTransfer();
    }
  },

  incidentShowPage: function() {
    this.recordShowPage();
    new _primero.Views.SummaryPage();
    this.incidentRecordForm()
  },

  formControls: function() {
    new _primero.Views.DateControl();
  },

  recordForms: function() {
    this.recordActions();

    if ($('form:not("#search_form")').length > 0) {
      _primero.shared_fields = new _primero.Views.SharedFields();
      new _primero.Views.PopulateSelectBoxes();
      new _primero.Views.PopulateLocationSelectBoxes();
      new _primero.Views.PopulateReportingLocationSelectBoxes();
      new _primero.Views.ServiceSubform();
      new _primero.Views.RequiredFields();
      new _primero.Views.AutosumFields();
      new _primero.Views.AutoCalculateAgeDOB();
      new _primero.Views.DateRangeControl();
      new _primero.Views.DateRangeValidation();
      new _primero.Views.HiddenTextField();
      new _primero.Views.TickBoxField();
      new _primero.Views.FileUploadField();
      new _primero.Views.ToggableField();
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
    new _primero.Views.ReportFilters();
  },

  bulk_exports: function(){
    this.initIndexTable();
  },

  tasks: function(){
    this.initIndexTable();
  },

  initAudio: function() {
    new _primero.Views.PhotoAudioFields();
  },

  initIndexTable: function() {
    _primero.indexTable = new _primero.Views.IndexTable();
  },

  hasForm: function() {
    return $('.data-form').length > 0 ? true : false
  },

  roleIndexPage: function() {
    new _primero.Views.CopyRole();
  },

  formSectionEditPage: function() {
    new _primero.Views.VisibleMobileForm();
  },

  fieldEditPage: function() {
    new _primero.Views.VisibleMobileField();
  },

  maskedUserAndPasswordLogin: function() {
    var maskedUser = new MaskedUser(document.getElementById("user_name"));
    var maskedPassword = new MaskedPassword(document.getElementById("password"));
  },

  maskedUserAndPasswordReferal: function() {
    var $referral_modal = $("#referral-modal");
    new MaskedUser($referral_modal.find("#other_user_agency").get(0));
    new MaskedPassword($referral_modal.find("#password").get(0));
  },

  maskedUserAndPasswordTransfer: function() {
    var $transfer_modal = $("#transfer-modal");
    new MaskedUser($transfer_modal.find("#other_user_agency").get(0));
    new MaskedPassword($transfer_modal.find("#password").get(0));
  },

  locations: function(){
    new _primero.Views.Locations();
  },

  matchingConfigurationPage: function() {
    _primero.chosen(".default-form select.chosen-select");
    new _primero.Views.MatchingConfigurations();
    new _primero.Views.PopulateSelectBoxes();
    new _primero.Views.PopulateLocationSelectBoxes();
  },

  agencyForm: function() {
    _primero.chosen("select.chosen-select");
  }

});
