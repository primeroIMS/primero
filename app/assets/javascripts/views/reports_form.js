_primero.Views.ReportForm = Backbone.View.extend({

  el: '.reports_form',

  events: {
    'change #report_module_ids': 'reload_field_lookups',
    'change #report_record_type': 'reload_field_lookups',
    'click #report_filter_add_button': 'add_filter',
    'click .report_filter_remove_button': 'remove_filter',
    'change #report_aggregate_by': 'compute_aggregate_fields',
    'change #report_disaggregate_by': 'compute_aggregate_fields'
  },

  initialize: function() {
    if (this.$el.length){
      this.init_multi_select();
      this.reload_field_lookups();
    }
  },

  init_multi_select: function() {
    _primero.chosen('#report_module_ids');
    $('#report_aggregate_by, #report_disaggregate_by').chosen(this.chosen_options);
    $('.report_filter_value_string_row select.report_filter_input').chosen($.extend({},this.chosen_options,{max_selected_options: Infinity}));
    $('.report_filter_attribute').chosen(this.chosen_options).change(this, this.filter_attribute_selected);
  },

  // TODO: max_selected_options not working in chosen
  compute_aggregate_fields: function(e, value) {
    var self = this;
    var field = $(e.target);
    var selected = value.selected || value.deselected
    var selectedOption = field.find('option[value="' + selected + '"]');
    var dateOptionQuery = 'option[data-type="date_field"]';

    var oppositeField = e.target.id == 'report_aggregate_by' ?
      $('#report_disaggregate_by') : $('#report_aggregate_by');

    this.disallow_third_pivot();

    if (selectedOption.attr('data-type') == 'date_field') {
      if (value.selected) {
        field
          .find('option[data-type="date_field"][value!="' + selected + '"]')
          .attr('disabled', true);

        oppositeField.find(dateOptionQuery).attr('disabled', true);
      } else if (value.deselected) {
        field.find(dateOptionQuery).attr('disabled', false);
        oppositeField.find(dateOptionQuery).attr('disabled', false);
      }

      field.trigger('chosen:updated');
      oppositeField.trigger('chosen:updated');
    }

    self.set_chosen_order($(e.target), false);
  },

  disallow_third_pivot: function() {
    var dateOptionQuery = 'option[data-type="date_field"]:selected';
    var hasDisaggreageDateValue = $('#report_disaggregate_by').find(dateOptionQuery);
    var aggregateField = $('#report_aggregate_by');

    if (hasDisaggreageDateValue.length) {
      aggregateField.val(_.last(aggregateField.val()));
      aggregateField.data('chosen').max_selected_options = 1;
    } else {
      aggregateField.data('chosen').max_selected_options = 2;
    }
  },

  init_chosen_order: function(elements) {
    var self = this;
    setTimeout(function() {
      _.each(elements, function(element) {
        self.set_chosen_order($(element), true);
      });
    }, 100);
  },

  set_chosen_order: function(element, is_init) {
    var target = element,
        order = is_init ? target.parent().data('actual-order') : target.getSelectionOrder(true);
        select_control = target.parent().find('select');

    target.parent().find('.order_field').remove();

    _.each(order, function(item) {
      var data = {
        value: item,
        name: select_control.attr('name').replace(/\]\[]/, '_ordered][]')
      };
      target.parent().append(JST['templates/chosen_ordering_hidden_field'](data));
    });

    if (_.isArray(order) && is_init) {
      $(target).setSelectionOrder(order, true, true);
    }
  },

  chosen_options: {
    display_selected_options: false,
    width:'100%',
    search_contains: true,
    max_selected_options: 2
  },

  permitted_field_list_url: '/reports/permitted_field_list',

  lookups_for_field_url: '/reports/lookups_for_field',

  field_type_map: {},

  reload_field_lookups: function() {
    var self = this;
    //get the lookup values via ajax call
    var params = {
      module_ids: $('#report_module_ids').val(),
      record_type: $('#report_record_type').val()
    }
    var permitted_field_list_url = this.permitted_field_list_url + '?' + decodeURIComponent($.param(params));
    $.ajax(permitted_field_list_url).done(function(permitted_field_list){
      //construct the options list
      var constructed_options_list = [];
      var constructed_options_list_numeric = [];
      for (var i in permitted_field_list){
        var form_name = permitted_field_list[i][0];
        var form_fields = permitted_field_list[i][1];
        constructed_options_list.push(
          "<optgroup label=\"" + form_name + "\">"
        );
        for (var j in form_fields){
          constructed_options_list.push(
            "<option data-type=\"" + form_fields[j][2] + "\" value=\"" + form_fields[j][1] + "\">" + form_fields[j][0] + "</option>"
          );
          if (form_fields[j][2] === 'tally_field' || form_fields[j][2] === 'numeric_field'){
            constructed_options_list_numeric.push(
              "<option data-type=\"" + form_fields[j][2] + "\" value=\"" + form_fields[j][1] + "\">" + form_fields[j][0] + "</option>"
            );
          }
          self.field_type_map[form_fields[j][1]] = form_fields[j][2];
        }
        constructed_options_list.push("</optgroup>");
      }
      var empty_selection = "<option value>" + $('.report_filter_attribute_template').attr('data-placeholder') + "</option>";
      //prepend the empty selection option to report_aggregate_counts_from
      constructed_options_list_numeric.unshift(empty_selection)

      $('#report_aggregate_by, #report_disaggregate_by, .report_filter_attribute, .report_filter_attribute_template, #report_aggregate_counts_from').each(function(){
        el = $(this);
        var current_value = el.val();
        //attach the options list to the target elements
        if (this.id === 'report_aggregate_counts_from'){
          el.html(constructed_options_list_numeric.join("\n"));
        } else {
          el.html(constructed_options_list.join("\n"));
        }
        //select the selected option values
        if (current_value !== null && current_value !== ""){
          var current_value_selector;
          if (current_value.constructor === Array){
            current_value_selector = current_value.map(function(v){
              return "option[value='" + v + "']";
            }).join(',');
          } else {
            current_value_selector = "option[value='" + current_value + "']";
          }
          el.find(current_value_selector).attr('selected','selected');
        }
      });
      //prepend the empty selection option to filter attributes and template
      $('.report_filter_attribute, .report_filter_attribute_template').prepend(empty_selection);
      //trigger the chosen reload
      $('#report_aggregate_by, #report_disaggregate_by, .report_filter_attribute').trigger("chosen:updated");
      self.init_chosen_order($('#report_aggregate_by, #report_disaggregate_by'));
    });
  },

  add_filter: function() {
    //determine the new index
    var new_index = $('div.report_filters_container').children().size();
    var template = $('.report_filter_template');
    //duplicate the template
    var new_filter = template.clone();
    //replace the template ids and template names
    new_filter.find('.report_filter_attribute_template, .report_filter_input_template').each(function(){
      var id = this.getAttribute('id').replace(/_template_/g, '_' + new_index + '_');
      var name = this.getAttribute('name').replace(/\[template\]/g, '[' + new_index + ']');
      var css_class = this.getAttribute('class').replace(/_template/g, '')
      this.setAttribute('id', id);
      this.setAttribute('name', name);
      this.setAttribute('class', css_class);
    });
    //get rid of the template class
    new_filter.attr('class', template.attr('class').replace(/report_filter_template/,'report_filter'));

    $('div.report_filters_container').append(new_filter);
    new_filter.find('.report_filter_attribute').chosen(this.chosen_options).change(this, this.filter_attribute_selected);
    _primero.set_content_sidebar_equality();
  },

  remove_filter: function(e) {
    //remove the current filter
    var current_filter = $(e.currentTarget).parent().parent().parent();
    current_filter.remove();
    //reassign the index for names and ids
    var index = 0;
    $('div.report_filters_container').children().each(function(){
      $(this).find('.report_filter_attribute, .report_filter_input').each(function(){
        var el = $(this);
        var id = el.attr('id').replace(/_\d+_/g, '_' + index + '_');
        var name = el.attr('name').replace(/\[\d+\]/g, '[' + index + ']');
        el.attr('id', id);
        el.attr('name', name);
      });
      index += 1;
    });
  },

  filter_attribute_selected: function(e){
    var report_filter_view = e.data;
    var attribute_dropdown = $(e.currentTarget);
    var report_filter = attribute_dropdown.parent().parent().parent();
    var attribute = attribute_dropdown.val();
    var type = report_filter_view.field_type_map[attribute];
    var string_select = report_filter.find('.report_filter_value_string_row select');
    var string_select_not_null_translation = string_select.data('not-null-translation')
    if (type === 'date_field'){
      //display the date field row
      report_filter.find('.report_filter_value_date_row').css('display', 'inline');
      report_filter.find('.report_filter_value_numeric_row, .report_filter_value_string_row').remove();
    } else if (type === 'numeric_field') {
      //display the numeric field row
      report_filter.find('.report_filter_value_numeric_row').css('display', 'inline');
      report_filter.find('.report_filter_value_date_row, .report_filter_value_string_row').remove();
    } else {
      //display the select
      report_filter.find('.report_filter_value_string_row').css('display', 'inline');
      report_filter.find('.report_filter_value_date_row, .report_filter_value_numeric_row').remove();
      //populate the value select via an ajax call
      var lookups_for_field_url = report_filter_view.lookups_for_field_url + '?' + decodeURIComponent($.param({field_name: attribute}));
      $.ajax(lookups_for_field_url).done(function(lookups_for_field){
        var constructed_options_list = [];
        constructed_options_list.push("<option value='not_null'>" + string_select_not_null_translation + "</option>")
        for (var i in lookups_for_field){
          if (lookups_for_field[i].constructor === Array){
            constructed_options_list.push(
              "<option value=\"" + lookups_for_field[i][1] + "\">" + lookups_for_field[i][0] + "</option>"
            );
          }  else {
            constructed_options_list.push(
              "<option>" + lookups_for_field[i] + "</option>"
            );
          }
        }
        var el = report_filter.find('.report_filter_value_string_row select')
        el.html(constructed_options_list.join("\n"));
        el.chosen($.extend({},report_filter_view.chosen_options,{max_selected_options: Infinity}));
      });
    }
    attribute_dropdown.find('option[value!=' + attribute + ']').remove();
    attribute_dropdown.trigger('chosen:updated');
  }

});
