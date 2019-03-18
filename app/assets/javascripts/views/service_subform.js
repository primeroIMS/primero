_primero.Views.ServiceSubform = _primero.Views.Base.extend({
  el: '.side-tab-content',

  events: {
    'change #services_section select[id$="service_type"]': 'on_filter_change',
    'change #services_section select[id$="service_implementing_agency"]': 'on_filter_change',
    'change #services_section select[id$="service_delivery_location"]': 'on_filter_change',
    'change #services_section select[id$="service_implementing_agency_individual"]': 'on_user_change',
    'click #tab_services #subform_services_section_add_button': 'init_subform'
  },

  initialize: function(){
    var self = this;

    $('#services_section .subform_container').each(function(index, subform){
      var $subform = $(subform);
      $subform.find('select[id$="service_implementing_agency_individual"]').on('chosen:ready', function(e) {
        self.set_user_filters($subform);
      });
    })
  },

  on_filter_change: function(e){
    var $selected_subform = $(e.target).parents('.subform_container');
    this.set_user_filters($selected_subform);
    this.clear_user_selection($selected_subform);
  },

  on_user_change: function(e) {
    var self = this;
    var selected_user_name = $(e.target).val();

    if(selected_user_name) {
      var selected_user = _primero.populated_user_collection.get_by_user_name(selected_user_name);

      if(selected_user){
        var $subform = $(e.target).parents('.subform_container');
        var $agency_select = $subform.find('select[id$="service_implementing_agency"]');
        $agency_select.val(selected_user.organization);
        $agency_select.trigger("chosen:updated");
        self.populate_location_filter($subform, selected_user.reporting_location_code);
      }
    }
  },

  populate_location_filter: function($subform, location_code,  onComplete){
    var $location_select = $subform.find('select[id$="service_delivery_location"]');
    $location_select.data('value', location_code);
    _primero.populate_location_select_boxes(function(){
      $location_select.val(location_code);
      $location_select.trigger("chosen:updated");

      if(onComplete){
        onComplete();
      }
    });
  },

  set_user_filters: function($subform){
    var $service_select = $subform.find('select[id$="service_type"]');
    var $agency_select = $subform.find('select[id$="service_implementing_agency"]');
    var $location_select = $subform.find('select[id$="service_delivery_location"]');

    var $user_select = $subform.find('select[id$="service_implementing_agency_individual"]');
    //Reset the selected value when filters change.
    $user_select.data('value', '');
    $user_select.data('filter-service', $service_select.val());
    $user_select.data('filter-agency', $agency_select.val());
    $user_select.data('filter-location', $location_select.val());
  },

  init_subform: function(){
    var self = this;
    setTimeout(function(){
      var $new_subform = $('#services_section .subform_container').last(); //Last added service
      var $new_select = $new_subform.find('select[id$="service_implementing_agency_individual"]');
      var selectorId = "#" + $new_select.attr('id');
      new _primero.Views.PopulateUserSelectBoxes({ el: selectorId });
    },0); //Try to run after the fadeOut in the forms
  },

  clear_user_selection: function($subform){
    var $user_select = $subform.find('select[id$="service_implementing_agency_individual"]');
    $user_select.empty();
    $user_select.html('<option value=""></option>');
    $user_select.trigger('change');
    $user_select.trigger('chosen:updated');
  }

});
