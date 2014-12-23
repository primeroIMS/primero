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
  },

  init_multi_select: function() {
    //_primero.chosen('.reports_form select[multiple]');
    _primero.chosen('#report_module_ids');
    $('#report_aggregate_by, #report_disaggregate_by, .report_filter_attribute').chosen(this.chosen_options);
  },

  chosen_options: {
    display_selected_options: false,
    width:'100%',
    search_contains: true,
    max_selected_options: 2
  },

  permitted_field_list_url: '/reports/permitted_field_list',

  reload_field_lookups: function() {
    var self = this;
    //get the lookup values via ajax call
    var params = {
        //module_ids: $('#report_module_ids').val().join(','),
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
          var current_value_selector = current_value.map(function(v){
            return "option[value='" + v + "']"
          }).join(',');
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
    new_filter.find('.report_filter_attribute_template').each(function(){
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
    new_filter.find('.report_filter_attribute').chosen(this.chosen_options);
    _primero.set_content_sidebar_equality();
  },

  remove_filter: function(event) {
    //remove the current filter
    var current_filter = $(event.currentTarget).parent().parent();
    current_filter.remove();
    //reassign the index for names and ids
    var index = 0;
    $('div.report_filters_container').children().each(function(){
      var filter_attribute = $(this).find('.report_filter_attribute');
      var id = filter_attribute.attr('id').replace(/_\d+_/g, '_' + index + '_');
      var name = filter_attribute.attr('name').replace(/\[\d+\]/g, '[' + index + ']');
      filter_attribute.attr('id', id);
      filter_attribute.attr('name', name);
      index += 1;
    });
  },

});

$(document).ready(function() {
  new ReportForm();
});