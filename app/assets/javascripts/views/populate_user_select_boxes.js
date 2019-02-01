_primero.UserSelectBoxFilters = [];

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
    if(users && users.length > 0){
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
    this.option_string_sources = ['User']

    this.collection = new _primero.Collections.UsersCollection();

    this.initialOptions();

    this.populateSelectBoxes();
  },

  filters: null,

  initialOptions: function() {
    var self = this;
    self.collection.selected_values = [];
    _.each(self.$el, function(select_box){
      var $select_box = $(select_box);
      var value = $select_box.data('value');
      var options = self.getOptionsFromValue(value);
      self.collection.selected_values = _.filter(options, function(option){
        return _.where(self.collection.selected_values, { id: value }).length < 1;
      });
      self.addOptions(options, $select_box);
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

  populateSelectBoxes: function(onComplete) {
    var self = this;

    this.$el.on('chosen:ready', function(e) {
      self.initAutoComplete($(e.target))
    });

    this.$el.on('chosen:showing_dropdown', function(e){
      var data = null;

      if (_primero.UserSelectBoxFilters.length > 0) {
        var selectBoxFilter =_.first(_.filter(_primero.UserSelectBoxFilters, function(filter){
          return $(e.target).attr('id').endsWith(filter.id);
        }));
        data = selectBoxFilter.getFilters();
      }

      if (self.collection.length < 1 || !_.isEmpty(_.compact(_.values(data)))) {
        self.collection.fetch({data: data})
            .done(function() {
              self.parseOptions();

              if (onComplete) {
                onComplete();
              }
            })
            .fail(function() {
              self.collection.message = I18n.t('messages.string_sources_failed')
              self.disableAjaxSelectBoxes();
            });
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
        response(self.addOptions(options, element))

        this.element.val(request.term);
      }
    })
  },

  parseOptions: function() {
    var self = this;

    if (this.collection.status) {
      var select_boxes = document.querySelectorAll("[data-populate='User']");
      var $select_boxes = $(select_boxes);
      var models = this.collection.models.map(function(model){ return model.attributes; });
      var options = self.convertToOptions(models);
      self.addOptions(options, $select_boxes);

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
