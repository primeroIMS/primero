_primero.Views.ServiceSubform = _primero.Views.Base.extend({
  el: '.side-tab-content',

  events: {
    'change #services_section select[id$="service_type"]': 'on_service_change',
    'change #services_section select[id$="service_implementing_agency"]': 'on_agency_change',
    'change #services_section select[id$="service_delivery_location"]': 'on_filter_change',
    'change #services_section select[id$="service_implementing_agency_individual"]': 'on_user_change'
  },

  initialize: function(){
    var self = this;

    $('#services_section .subform_container').each(function(index, subform){
      var $subform = $(subform);
      $subform.find('select[id$="service_implementing_agency_individual"]').on('chosen:ready', function(e) {
        self.set_user_filters($subform);
        self.set_agency_filters($subform);
      });
    })
  },

  on_service_change: function(e) {
    var $selected_subform = $(e.target).parents('.subform_container');
    this.set_agency_filters($selected_subform);
    this.set_user_filters($selected_subform);
    this.clear_user_selection($selected_subform);
    this.clear_agency_selection($selected_subform);
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
        self.populate_agency_filter($subform, selected_user.organization);
        self.populate_location_filter($subform, selected_user.reporting_location_code);
      }
    }
  },

  on_agency_change: function(e) {
    var $selected_subform = $(e.target).parents('.subform_container');
    var $agency_select = $(e.target);
    $agency_select.data('value', $agency_select.val());
    this.set_user_filters($selected_subform);
    this.clear_user_selection($selected_subform);
  },

  populate_location_filter: function($subform, location_code,  onComplete){
    var self = this;
    var $location_select = $subform.find('select[id$="service_delivery_location"]');
    $location_select.data('value', location_code);
    _primero.populate_reporting_location_select_boxes($location_select, function(){
      /*
       * We select the value only if exists or empty, otherwise it will be null
       * resulting in the value not being sent to the server.
       */
      if(self.has_option_value($location_select, location_code)){
        $location_select.val(location_code);

      } else {
        $location_select.val('')
      }

      $location_select.trigger("chosen:updated");
      self.set_user_filters($subform);

      if(onComplete){
        onComplete();
      }
    });
  },

  populate_agency_filter: function($subform, agency_id, onComplete) {
    var self = this;
    self.set_agency_filters($subform);
    var $agency_select = $subform.find('select[id$="service_implementing_agency"]');
    _primero.populate_agency_select_boxes($agency_select, function() {
      /*
       * We select the value only if exists or empty, otherwise it will be null,
       * resulting in the value not being sent to the server.
       */
      if(self.has_option_value($agency_select, agency_id)) {
        $agency_select.data('value', agency_id);
        $agency_select.val(agency_id);
      } else {
        $agency_select.data('value', '');
        $agency_select.val('')
      }
      $agency_select.trigger('chosen:updated');
      self.set_user_filters($subform);

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

  set_agency_filters: function($subform){
    var $service_select = $subform.find('select[id$="service_type"]');
    var $agency_select = $subform.find('select[id$="service_implementing_agency"]');

    $agency_select.data('filter-service-type', $service_select.val());
  },

  clear_user_selection: function($subform){
    var $user_select = $subform.find('select[id$="service_implementing_agency_individual"]');
    $user_select.empty();
    $user_select.html('<option value=""></option>');
    $user_select.trigger('change');
    $user_select.trigger('chosen:updated');
  },

  clear_agency_selection: function($subform){
    var $agency_select = $subform.find('select[id$="service_implementing_agency"]');
    $agency_select.empty();
    $agency_select.html('<option value=""></option>');
    $agency_select.trigger('change');
    $agency_select.trigger('chosen:updated');
  },

  has_option_value: function($select_box, value) {
    var option = $select_box.find('option[value="'+value+'"]');
    return option.length > 0 && option.css('display') != 'none';
  }

});
