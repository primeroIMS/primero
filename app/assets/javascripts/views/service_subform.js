_primero.Views.ServiceSubform = _primero.Views.Base.extend({
  el: '.side-tab-content',

  events: {
    'change #services_section select[id$="service_type"]': 'on_filter_change',
    'change #services_section select[id$="service_implementing_agency"]': 'on_filter_change',
    'change #services_section select[id$="service_delivery_location"]': 'on_filter_change'
  },

  initialize: function(){
    var self = this;
    self.collection = new _primero.Collections.UsersCollection();
    $('#services_section .subform_container').each(function(index, subform){
      var $subform = $(subform);
      $subform.find('select[id$=service_implementing_agency_individual]').on('chosen:showing_dropdown', function(){
        self.load_users($(subform));
      });
    })
  },

  on_filter_change: function(e){
    var self = this;
    var $selected_subform = $(e.target).parents('.subform_container');
    this.clear_user_selection($selected_subform);
  },

  load_users: function($subform){
    var self = this;
    var $service_select = $subform.find('select[id$="service_type"]');
    var $agency_select = $subform.find('select[id$="service_implementing_agency"]');
    var $user_select = $subform.find('select[id$=service_implementing_agency_individual]');
    var $location_select = $subform.find('select[id$=service_delivery_location]');

    $user_select.empty();
    $user_select.html('<option>' + I18n.t("messages.loading") + '</option>');
    $user_select.trigger("chosen:updated");

    var data = {
      services: $service_select.val(),
      agency_id: $agency_select.val(),
      location: $location_select.val()
    }

    self.collection
        .fetch({data: data})
        .done(function(){
          $user_select.empty();
          var select_options = [];
          if(self.collection.length > 0) {
            select_options.push('<option value=""></option>');
          } else {
            select_options.push('<option value="">'+I18n.t("no_results_found") +'</option>');
          }
          self.collection.each(function(user){
            var user_model = user.attributes;
            select_options.push('<option value="' + user_model.user_name + '">' + user_model.user_name + '</option>');
          })

          $user_select.html(select_options.join(''));
          $user_select.trigger("chosen:updated");
        });
  },

  clear_user_selection: function($subform){
    var $user_select = $subform.find('select[id$="service_implementing_agency_individual"]');
    $user_select.empty();
    $user_select.html('<option value=""></option>');
    $user_select.trigger('change');
    $user_select.trigger('chosen:updated');
  }

});
