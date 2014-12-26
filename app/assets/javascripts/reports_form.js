var ReportForm = Backbone.View.extend({

  el: '.reports_form',

  events: {
    'change #report_module_ids': 'reload_field_lookups',
    'change #report_record_type': 'reload_field_lookups',
    'click #report_filter_add_button': 'add_filter',
    'click .report_filter_remove_button': 'remove_filter'
  },

  initialize: function() {
    this.init_multi_select();
    this.reload_field_lookups();
  },

  init_multi_select: function() {
    _primero.chosen('#report_module_ids');
    $('#report_aggregate_by, #report_disaggregate_by').chosen(this.chosen_options);
    $('.report_filter_attribute').chosen(this.chosen_options).change(this, this.filter_attribute_selected);
  },

  chosen_options: {
    display_selected_options: false,
    width:'100%',
    search_contains: true,
    max_selected_options: 2
  },

  permitted_field_list_url: '/reports/permitted_field_list',

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
      for (var i in permitted_field_list){
        var form_name = permitted_field_list[i][0];
        var form_fields = permitted_field_list[i][1];
        constructed_options_list.push(
          "<optgroup label=\"" + form_name + "\">"
        );
        for (var j in form_fields){
          constructed_options_list.push(
            "<option value=\"" + form_fields[j][1] + "\">" + form_fields[j][0] + "</option>"
          );
          self.field_type_map[form_fields[j][1]] = form_fields[j][2];
        }
        constructed_options_list.push("</optgroup>");
      }
      $('#report_aggregate_by, #report_disaggregate_by, .report_filter_attribute, .report_filter_attribute_template').each(function(){
        el = $(this);
        var current_value = el.val();
        //attach the options list to the target elements
        el.html(constructed_options_list.join("\n"));
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
      //prepend the empty selection option
      var empty_selection = "<option value>" + $('.report_filter_attribute_template').attr('data-placeholder') + "</option>";
      $('.report_filter_attribute, .report_filter_attribute_template').prepend(empty_selection);
      //trigger the chosen reload
      $('#report_aggregate_by, #report_disaggregate_by, .report_filter_attribute').trigger("chosen:updated");
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
      var filter_attribute = $(this).find('.report_filter_attribute, .report_filter_input');
      var id = filter_attribute.attr('id').replace(/_\d+_/g, '_' + index + '_');
      var name = filter_attribute.attr('name').replace(/\[\d+\]/g, '[' + index + ']');
      filter_attribute.attr('id', id);
      filter_attribute.attr('name', name);
      index += 1;
    });
  },

  filter_attribute_selected: function(e){
    var attribute_dropdown = $(e.currentTarget);
    var report_filter = attribute_dropdown.parent().parent().parent();
    var attribute = attribute_dropdown.val();
    var type = e.data.field_type_map[attribute];
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
      //populate it via an ajax call (behind the scenes this is just a call to solr to get the populated value range for a field)
      report_filter.find('.report_filter_value_string_row').css('display', 'inline');
      report_filter.find('.report_filter_value_date_row, .report_filter_value_numeric_row').remove();
    }
    attribute_dropdown.find('option[value!=' + attribute + ']').remove();
    attribute_dropdown.trigger('chosen:updated');
  }

});

$(document).ready(function() {
  new ReportForm();
});