_primero.Collections.UsersCollection = Backbone.Collection.extend({
  url: '/api/users',

  selected_values: null,

  parse: function(resp) {
    this.status = resp.success;
    this.message = resp.message;
    return resp.users;
  },

  get_by_user_name: function(user_name){
    var users = this.where({user_name: user_name});
    var user = null;

    if (users && users.length > 0) {
      user = _.first(users).attributes;
    }
    return user;
  },

  find_by_user_name: function(user_name){
    var regex = new RegExp(user_name, 'i');
    var self = this;
    var users = self.filter(function(user){
      return regex.test(user.get('user_name'));
    })
    return _.map(users, function(user){ return user.attributes; });
  }
});

_primero.Views.PopulateUserSelectBoxes = _primero.Views.PopulateLocationSelectBoxes.extend({
  el: "form select[data-populate='User']",

  initialize: function(){
    this.option_string_sources = ['User'];

    this.collection = new _primero.Collections.UsersCollection();

    this.initialOptions();

    this.populateSelectBoxes();
  },

  filters: null,

  initialOptions: function() {
    var self = this;
    self.collection.selected_values = [];

    _primero.init_user_options = function($select_box) {
      var value = $select_box.data('value');
      var options = self.getOptionsFromValue(value);
      self.collection.selected_values = _.filter(options, function(option){
        return _.where(self.collection.selected_values, { id: value }).length < 1;
      });
      self.addOptions(options, $select_box);
    }

    _.each(self.$el, function(select_box){
      var $select_box = $(select_box);
      _primero.init_user_options($select_box);
    });
  },

  getOptionsFromValue: function(value) {
    var options = [];

    if (value) {
      // In case of multiselect
      if ($.isArray(value)) {
        options = _.map(value, function(selected_value){
          return { id: selected_value, display_text: selected_value };
        });

      } else {
        options.push({ id: value, display_text: value });
      }
    }
    return options;
  },

  populateSelectBoxes: function() {
    var self = this;

    this.$el.on('chosen:ready', function(e) {
      self.initAutoComplete($(e.target));
    });

    this.$el.on('chosen:showing_dropdown', function(e){
      var $select_box = $(e.target);
      var filters_required = $select_box.data("filters-required");
      var transition_type = $select_box.data("filter-transition-type");
      var service = $select_box.data("filter-service");
      var agency = $select_box.data("filter-agency");
      var location = $select_box.data("filter-location");

      var data_filters = {
        services: service,
        agency_id: agency,
        location: location
      };

      if (!filters_required || (filters_required && !_.isEmpty(_.compact(_.values(data_filters))))) {

        // TODO: Referrals will be the default transition until we find a better solution for this. If the
        // transition param is not specified the user api will always return empty.

        // This is not a required filter, that's why we don't validate it above.
        data_filters.transition_type = transition_type ? transition_type : 'referral';

        if (self.collection.length < 1 || !_.isEqual(self.filters, data_filters)) {

          self.filters = data_filters;

          if (!$select_box.attr('multiple')) {
            $select_box.empty();
            $select_box.html('<option>' + I18n.t("messages.loading") + '</option>');
            $select_box.trigger("chosen:updated");
          }

          self.collection.fetch({data: self.filters})
              .done(function() {
                self.parseOptions($select_box);
                _primero.populated_user_collection = self.collection;
              })
              .fail(function() {
                self.collection.message = I18n.t('messages.string_sources_failed');
                self.disableAjaxSelectBoxes();
              });

        } else {
          // Use the data that we have.
          self.parseOptions($select_box);
        }

      } else {
        alert(I18n.t('messages.valid_search_criteria'));
      }
    });
  },

  initAutoComplete: function($select_boxes) {
    var self = this;

    $select_boxes.parent().find('.chosen-search input').autocomplete({
      delay: 900,
      source: function(request, response) {
        var element = this.element.parents('.chosen-container').prev('select');
        var users = _.first(self.collection.find_by_user_name(request.term), 50);
        options = _.compact(_.union(self.convertToOptions(users), self.collection.selected_values));
        response(self.addOptions(options, element));

        this.element.val(request.term);
      }
    })
  },

  parseOptions: function($select_box) {
    var self = this;

    if (this.collection.status) {
      var models = this.collection.models.map(function(model){ return model.attributes; });
      var options = self.convertToOptions(models);
      self.addOptions(options, $select_box);

    } else {
      this.disableAjaxSelectBoxes();
    }
  },

  convertToOptions: function(models){
    return _.map(models, function(model){
      return { id: model.user_name, display_text: model.user_name };
    });
  }
});
