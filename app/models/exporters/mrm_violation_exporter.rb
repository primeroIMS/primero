# frozen_string_literal: true

require 'write_xlsx'

# rubocop:disable Style/ClassAndModuleChildren
module Exporters
  # Class for MRMVioletion Exporter
  # rubocop:disable Metrics/ClassLength
  class MRMViolationExporter < BaseExporter
    VERIFICATION_FIELD_NAMES = %w[
      verifier_id_code
      verification_source_primary_number
      verification_source_secondary_number
      un_eyewitness
      verified
      verification_date_focal_point
      verified_ctfmr_technical
      verification_date_ctfmr_technical
      ctfmr_verified
      ctfmr_verified_date
      verification_additional
      verified_ghn_reported
    ].freeze
    INCIDENT_FORMS = %w[incident_form].freeze
    INCIDENT_ID_FIELD_NAMES = %w[incident_id short_id].freeze
    FIELD_DISPLAY_NAME = {
      'violation_tally' => 'Number of victims',
      'facility_attack_type' => 'Type of health- or education-related violation',
      'facility_operational_before' => 'Was the facility operational before the attack or military use?',
      'human_impact_of_attack_section' => 'Human impact of the attack (Adult impact for Denial of Humanitarian Access)',
      'facility_impact_section' => 'Physical impact of the attack or military use',
      'facility_closed' => 'Was the facility closed as a result of the attack or military use?'
    }.freeze
    VIOLATIONS_IDS_FIELD_NAME = 'violations_ids'
    ASSOCIATION_ID_NAME = {
      'individual_victims' => 'Individual Victim',
      'group_victims' => 'Group Victim',
      'sources' => 'Source',
      'perpetrators' => 'Perpetrator',
      'responses' => 'Response'
    }.freeze
    ID_CELL_LENGTH = 300
    INCIDENT_CODE_CELL_LENGTH = 85

    attr_accessor :workbook, :worksheets, :constrained_subforms

    # rubocop:enable Style/ClassAndModuleChildren
    class << self
      def id
        'mrm_violation_xls'
      end

      def mime_type
        'xlsx'
      end

      def supported_models
        [Incident]
      end
    end

    def initialize(output_file_path = nil, config = {}, options = {})
      super(output_file_path, config, options)
      self.worksheets = {}
      self.workbook = WriteXLSX.new(buffer)
      build_formats
    end

    def complete
      workbook.close
    end

    def export(records)
      violations = Violation.where(incident_id: records).order(:incident_id, :id)
      write_violations(violations)
      write_violation_associations(violations)
    end

    def user_permitted_forms(record_type, user, _include_subforms)
      super(record_type, user, true)
    end

    private

    def field_display_name(field)
      FIELD_DISPLAY_NAME[field.name] || field.display_name(locale)
    end

    def build_formats
      @formats = {
        black: workbook.add_format(color: '#231F20'),
        centered_black: workbook.add_format(color: '#231F20', center_across: 1),
        date: workbook.add_format(num_format: 'dd-mm-yyyy'),
        date_time: workbook.add_format(num_format: 'dd-mm-yyyyThh:mm:ss.sss')
      }
    end

    def incident_form_fields
      return @incident_form_fields if @incident_form_fields.present?

      incident_form = forms.find { |form| form.unique_id == 'incident_form' }
      exportable_fields = exportable_form_fields(incident_form)
      @incident_form_fields = exportable_fields.reject { |field| INCIDENT_ID_FIELD_NAMES.include?(field.name) }
      @incident_form_fields.sort_by(&:order)
    end

    def fields_by_violation_type
      @fields_by_violation_type ||= violation_forms.each_with_object({}) do |form, memo|
        exportable_fields = exportable_form_fields(form)
        memo[form.unique_id] = exportable_fields.select do |field|
          violation_fields.count { |vfield| vfield.name == field.name } == 1 &&
            VERIFICATION_FIELD_NAMES.exclude?(field.name)
        end
      end
    end

    def violation_forms
      @violation_forms ||= forms.select { |form| Violation::TYPES.include?(form.unique_id) }
    end

    def violation_fields
      @violation_fields ||= violation_forms.select do |form|
        Violation::TYPES.include?(form.unique_id)
      end.map(&:fields).flatten
    end

    def shared_violation_fields
      return @shared_violation_fields if @shared_violation_fields.present?

      excluded_field_names = VERIFICATION_FIELD_NAMES + fields_by_violation_type.values.flatten.map(&:name)
      @shared_violation_fields = violation_fields.group_by(&:name).reduce([]) do |acc, (name, fields)|
        next(acc) if excluded_field_names.include?(name)

        acc + [fields.first]
      end.sort_by(&:order)
      @shared_violation_fields
    end

    def verification_fields
      @verification_fields ||= fields.select { |field| VERIFICATION_FIELD_NAMES.include?(field.name) }.sort_by(&:order)
    end

    def association_forms
      @association_forms ||= forms.select do |form|
        Violation::MRM_ASSOCIATIONS_KEYS.include?(form.unique_id)
      end.sort_by(&:order)
    end

    def exportable_form_fields(form)
      return [] unless form.present?

      form.fields.select { |field| EXPORTABLE_FIELD_TYPES.include?(field.type) }
    end

    def exportable_subform_fields(subform)
      exportable_form_fields(subform).reject { |field| field.name == VIOLATIONS_IDS_FIELD_NAME }
    end

    def write_violations(violations)
      write_worksheet_headers(2, 4, :violations, I18n.t('incident.violation.title'), all_shared_violation_fields)
      @record_row = worksheets[:violations][:row]
      write_violations_data(violations, worksheets[:violations][:worksheet])
      worksheets[:violations][:row] = @record_row
    end

    def all_shared_violation_fields
      incident_form_fields + verification_fields + shared_violation_fields
    end

    def write_worksheet_headers(initial_row, initial_column, id, name, fields)
      return if worksheets.dig(id, :worskheet).present?

      @header_column = initial_column
      @header_row = initial_row
      worksheet = workbook.add_worksheet(build_worksheet_name(name))
      write_violation_id_headers(worksheet)
      write_association_header(worksheet, id) if id != :violations
      write_field_headers(worksheet, fields)
      write_violation_headers_by_type(worksheet) if id == :violations
      self.worksheets = { id => { worksheet:, row: id == :violations ? 3 : 2 } }
    end

    def write_association_header(worksheet, id)
      worksheet.set_column_pixels(name_first_cell_by_column(4), name_first_cell_by_column(4), INCIDENT_CODE_CELL_LENGTH)
      worksheet.set_column_pixels(name_first_cell_by_column(5), name_first_cell_by_column(5), ID_CELL_LENGTH)
      worksheet.write(@header_row, 4, I18n.t('incident.code'))
      worksheet.write(@header_row, 5, "#{ASSOCIATION_ID_NAME[id]} ID")
    end

    def write_violation_headers_by_type(worksheet)
      Violation::TYPES.each do |type|
        violation_fields = fields_by_violation_type[type]
        start_column = @header_column
        write_field_headers(worksheet, violation_fields)
        write_violation_type_header(start_column, @header_column - 1, worksheet, violation_fields, type)
      end
    end

    def write_violation_id_headers(worksheet)
      worksheet.set_column_pixels(name_first_cell_by_column(0), name_first_cell_by_column(3), ID_CELL_LENGTH)
      worksheet.merge_range(@header_row - 1, 0, @header_row - 1, 1, I18n.t('incidents.id'), @formats[:centered_black])
      worksheet.write(@header_row, 0, I18n.t('forms.record_types.incident'))
      worksheet.write(@header_row, 1, I18n.t('forms.record_types.violation'))
      worksheet.write(@header_row, 2, I18n.t('incidents.violation_type'))
      worksheet.write(@header_row, 3, I18n.t('incidents.violation_summary'))
    end

    def write_violation_type_header(start_column, end_column, worksheet, violation_fields, type)
      if violation_fields.size > 1
        worksheet.merge_range(
          0, start_column, 0, end_column, I18n.t("incident.violation.types.#{type}"), @formats[:centered_black]
        )
      else
        worksheet.write(0, end_column, I18n.t("incident.violation.types.#{type}"))
      end
    end

    def write_field_headers(worksheet, fields)
      fields.each do |field|
        if field.type == Field::TALLY_FIELD
          write_tally_field_header(worksheet, field)
        elsif field.type == Field::SUBFORM
          write_field_headers(worksheet, exportable_subform_fields(field.subform).sort_by(&:order))
        else
          write_field_header(worksheet, field)
        end
      end
    end

    def write_field_header(worksheet, field)
      display_name = field_display_name(field)
      worksheet.set_column_pixels(
        name_first_cell_by_column(@header_column),
        name_first_cell_by_column(@header_column),
        display_name.length * 11
      )
      worksheet.write(@header_row, @header_column, display_name)
      @header_column += 1
    end

    def write_tally_field_header(worksheet, field)
      tally_row = @header_row - 1
      worksheet.merge_range(
        tally_row,
        @header_column,
        tally_row,
        @header_column + field.tally.size,
        field_display_name(field),
        @formats[:centered_black]
      )
      write_tally_option_headers(worksheet, field)
    end

    def write_tally_option_headers(worksheet, field)
      field.tally(locale).each do |option|
        display_text = option['display_text']
        worksheet.set_column_pixels(name_first_cell_by_column(@header_column),
                                    name_first_cell_by_column(@header_column), display_text.length * 11)
        worksheet.write(@header_row, @header_column, display_text)
        @header_column += 1
      end

      return unless field.autosum_total

      worksheet.write(@header_row, @header_column, I18n.t('fields.total'))
      @header_column += 1
    end

    def write_violations_data(violations, worksheet)
      violations.each do |violation|
        write_violation_data_ids(worksheet, violation)
        @record_column = 4
        write_record_data(worksheet, violation.incident, incident_form_fields)
        write_record_data(worksheet, violation, verification_fields)
        write_record_data(worksheet, violation, shared_violation_fields)
        Violation::TYPES.each { |type| write_record_data(worksheet, violation, fields_by_violation_type[type]) }

        @record_row += 1
      end
    end

    def write_violation_data_ids(worksheet, violation)
      worksheet.write_string(@record_row, 0, violation.incident.id, @formats[:black])
      worksheet.write_string(@record_row, 1, violation.id, @formats[:black])
      worksheet.write_string(@record_row, 2, I18n.t("incident.violation.types.#{violation.type}"), @formats[:black])
      worksheet.write_string(@record_row, 3, violation_summary(violation), @formats[:black])
    end

    def violation_summary(violation)
      collapsed_field_values = FormSection.find_by(unique_id: violation.type).collapsed_fields.map do |field|
        export_value(violation.data[field.name], field)
      end.join(' - ')
      violation_short_id = violation.id[0..4]

      [
        I18n.t("incident.violation.types.#{violation.type}"),
        collapsed_field_values,
        violation_short_id
      ].filter(&:present?).join(' - ')
    end

    def write_record_data(worksheet, record, fields)
      return unless fields.present?

      fields.each do |field|
        if field.type == Field::SUBFORM
          write_record_data(worksheet, record, exportable_subform_fields(field.subform).sort_by(&:order))
        else
          write_field_data(worksheet, record, field)
        end
      end
    end

    def write_field_data(worksheet, record, field)
      case field.type
      when Field::TALLY_FIELD then write_tally_data(worksheet, record, field)
      when Field::TEXT_FIELD, Field::TEXT_AREA then write_string_data(worksheet, record, field)
      when Field::DATE_FIELD then write_date_data(worksheet, record, field)
      else
        worksheet.write(@record_row, @record_column, export_value(record.data[field.name], field))
        @record_column += 1
      end
    end

    def write_string_data(worksheet, record, field)
      field_value = export_value(record.data[field.name], field)
      if field_value.present?
        worksheet.write_string(@record_row, @record_column, field_value, @formats[:black])
      else
        worksheet.write_blank(@record_row, @record_column, @formats[:black])
      end
      @record_column += 1
    end

    def write_date_data(worksheet, record, field)
      date_format = field.date_include_time ? @formats[:date_time] : @formats[:date]
      field_value = export_value(record.data[field.name], field)
      if field_value.present?
        worksheet.write_date_time(@record_row, @record_column, field_value, date_format)
      else
        worksheet.write_blank(@record_row, @record_column, @formats[:black])
      end
      @record_column += 1
    end

    def write_tally_data(worksheet, record, field)
      tally_options = field.tally(locale)
      tally_options.each do |option|
        worksheet.write(@record_row, @record_column, record.data.dig(field.name, option['id']))
        @record_column += 1
      end

      return unless field.autosum_total

      worksheet.write(@record_row, @record_column, record.data.dig(field.name, 'total'))
      @record_column += 1
    end

    alias super_export_value export_value
    def export_value(value, field)
      case field.type
      when Field::DATE_FIELD then date_value(value, field)
      when Field::SELECT_BOX then select_value(value, field)
      else super_export_value(value, field)
      end
    end

    def date_value(value, field)
      return unless value.present?
      return value.strftime('%Y-%m-%dT%H:%M:%S.%L') if field.date_include_time

      value.strftime('%Y-%m-%dT')
    end

    def select_value(value, field)
      if field.multi_select && value.present? && value.is_a?(Array)
        return value.map { |current| super_export_value(current, field) }.join(' ||| ')
      end

      super_export_value(value, field)
    end

    def write_violation_associations(violations)
      association_forms.each do |form|
        association_form_fields = exportable_form_fields(form).sort_by(&:order)
        write_worksheet_headers(1, 6, form.unique_id, form.name(locale), association_form_fields)
        write_associations(violations, form, association_form_fields)
      end
    end

    def write_association_ids(worksheet, violation, association)
      worksheet.write_string(@record_row, 4, violation.incident.incident_code, @formats[:black])
      worksheet.write_string(@record_row, 5, association.id, @formats[:black])
    end

    def write_associations(violations, form, association_form_fields)
      worksheet = worksheets[form.unique_id][:worksheet]
      @record_row = worksheets[form.unique_id][:row]
      write_association_data(worksheet, violations, association_form_fields, form.unique_id)
      worksheets[form.unique_id][:row] = @record_row
    end

    def write_association_data(worksheet, violations, association_form_fields, association_key)
      violations.each do |violation|
        associations = violation.send(association_key)
        next unless associations.present?

        associations.each do |record|
          @record_column = 6
          write_association_record(worksheet, violation, record, association_form_fields)
        end
      end
    end

    def write_association_record(worksheet, violation, association, association_form_fields)
      write_violation_data_ids(worksheet, violation)
      write_association_ids(worksheet, violation, association)
      write_record_data(worksheet, association, association_form_fields)
      @record_row += 1
    end

    def build_worksheet_name(worksheet_name)
      worksheet_name.truncate(31).gsub(%r{[\[\]/:*?]}, ' ')
    end
  end
  # rubocop:enable Metrics/ClassLength
end
