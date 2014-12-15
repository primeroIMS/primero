var ReportForm = Backbone.View.extend({

  el: '.reports_form',

  events: {
    'change #report_module_ids': 'reload_field_lookups',
    'change #report_record_type': 'reload_field_lookups',
  },

  initialize: function() {
    this.init_multi_select();
  },

  init_multi_select: function() {
    //_primero.chosen('.reports_form select[multiple]');
    _primero.chosen('#report_module_ids');
    $('#report_aggregate_by, #report_disaggregate_by').chosen({
      display_selected_options: false,
      width:'100%',
      search_contains: true,
      max_selected_options: 2
    });
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
      $('#report_aggregate_by, #report_disaggregate_by').each(function(){
        el = $(this);
        var current_value = el.val();
        //attach the options list to the target elements
        el.html(constructed_options_list.join("\n"));
        //select the selected option values
        if (current_value !== null){
          var current_value_selector = current_value.map(function(v){
            return "option[value='" + v + "']"
          }).join(',');
          el.find(current_value_selector).attr('selected','selected');
        }
        //trigger the chosen reload
        el.trigger("chosen:updated");
      });
    });
  },

});

$(document).ready(function() {
  new ReportForm();
});