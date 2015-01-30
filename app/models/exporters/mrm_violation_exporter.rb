require 'writeexcel'
require_relative 'base.rb'

module Exporters
  class MRMViolationExporter < BaseExporter
    class << self
      def id
        'mrm_violation_xls'
      end

      def mime_type
        'xls'
      end

      def supported_models
        [Incident]
      end

      def export(incidents, *args)
        io = StringIO.new
        wb = WriteExcel.new(io)

        mrm_incidents = incidents.reject {|inc| inc.module.try(:id) != PrimeroModule::MRM }

        make_violations_tab(mrm_incidents, wb)
        make_related_data_tab(mrm_incidents, wb, 'Individual Details', 'individual_details_subform_section', 'individual_violations')
        make_related_data_tab(mrm_incidents, wb, 'Perpetrators', 'perpetrator_subform_section', 'perpetrator_violations')
        make_related_data_tab(mrm_incidents, wb, 'Source', 'source_subform_section', 'source_violations')
        make_related_data_tab(mrm_incidents, wb, 'Group Details', 'group_details_section', 'group_violations')
        wb.close
        io.string
      end

      def violation_types(incidents)
        incidents.map {|i| i.violation_category || [] }.flatten.uniq
      end

      def violation_column_generators(incidents)
        types = violation_types(incidents)
        all_keys = types.map do |t|
          violation_props = Incident.properties_by_name['violations'].type.properties_by_name[t].type.properties
          violation_props.map {|vp| vp.name }
        end.flatten.uniq

        all_keys.inject({}) {|acc, k| acc.merge({k => ->(incident, violation, type, rf=nil) { violation[k] } }) }
      end

      def incident_column_generators
        core_forms = ['Incident', 'Record Owner', 'Intervention']
        top_level_props = Incident.properties_by_form.slice(*core_forms).values.inject(&:merge)
        keys = top_level_props.keys
        keys.inject({}) {|acc, k| acc.merge({k => ->(incident, violation, type, rf=nil) { incident[k] } }) }
      end

      def prefix_column_generators
        {
          'incident_id' => ->(incident, violation, type, rf=nil) { incident.incident_id },
          'violation_id' => ->(incident, violation, type, rf=nil) { violation.unique_id },
          'summary' => ->(incident, violation, type, rf=nil) { violation_summary_value(incident, violation, type) },
        }
      end

      def violation_titleized(type)
        type.gsub(/_/, ' ').titleize
      end

      def violation_summary_value(incident, violation, type)
        idx = incident.violations[type].index(violation)
        parts = [violation_titleized(type), FormSection.get_by_unique_id(type).collapsed_fields.map {|cf| violation[cf] }].flatten.compact
        "#{parts.join(' - ')} #{idx}"
      end

      def make_violations_tab(incidents, workbook)
        worksheet = workbook.add_worksheet('Violations')
        generators = [prefix_column_generators, incident_column_generators, violation_column_generators(incidents)].inject(&:merge)
        worksheet.write_row(0, 0, generators.keys)
        fit_column_widths(worksheet, generators.keys)

        row_no = 1
        incidents.each do |inc|
          inc.each_violation do |violation, type|
            column_values = generators.map {|_,gen| gen.call(inc, violation, type) }
            worksheet.write_row(row_no, 0, format_values(column_values))
            row_no += 1
          end
        end
      end

      def find_related_fields_for_violation(related_field, violation_link_field, incident, violation, type)
        index = incident.violations[type].index(violation)
        unless index.nil?
          link_value = violation['unique_id']
          incident[related_field].select {|el| (el[violation_link_field] || []).include?(link_value) }
        else
          []
        end
      end

      def related_data_generators(related_field)
        keys = Incident.properties_by_name[related_field].type.properties_by_name.keys
        keys.inject({}) {|acc, k| acc.merge(k => ->(incident=nil, violation=nil, type=nil, rf) { rf[k] }) }
      end

      def make_related_data_tab(incidents, workbook, tab_name, related_field, violation_link_field)
        worksheet = workbook.add_worksheet(tab_name)

        generators = [prefix_column_generators, related_data_generators(related_field)].inject(&:merge)
        worksheet.write_row(0, 0, generators.keys)
        fit_column_widths(worksheet, generators.keys)

        row_no = 1
        incidents.each do |inc|
          inc.each_violation do |violation, type|
            find_related_fields_for_violation(related_field, violation_link_field, inc, violation, type).each do |rf|
              column_values = generators.map {|_, gen| gen.call(inc, violation, type, rf) }
              worksheet.write_row(row_no, 0, format_values(column_values))
              row_no += 1
            end
          end
        end
      end

      def fit_column_widths(worksheet, column_data)
        column_data.each_with_index do |d, i|
          worksheet.set_column(0, i, (d || " "*8).length)
        end
      end

      def format_values(values)
        values.map do |v|
          case v
          when Array
            v.join('; ')
          else
            v
          end
        end
      end
    end
  end
end

