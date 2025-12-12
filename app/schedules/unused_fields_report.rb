# frozen_string_literal: true

# Copyright (c) 2014 - 2025 UNICEF. All rights reserved.

# PeriodicJob to generate the Unused Fields Report
class UnusedFieldsReport < PeriodicJob
  def self.reschedule_after
    1.day
  end

  def perform_rescheduled
    Rails.logger.info 'Generating the Unused Fields Report...'
    UnusedFieldsReport.new.generate!
    Rails.logger.info 'Unused Fields Report generated.'
  end

  def self.generate!
    new.generate!
  end

  def generate!
    unused_fields_stats = build_unused_field_stats
    export_data = Exporters::UnusedFieldsExporter.export(unused_fields_stats)
    SystemSettings.current.unused_fields_report_file.attach(io: StringIO.new(export_data), filename: default_file_name)
    SystemSettings.current.save!
  end

  def build_unused_field_stats
    PrimeroModule.all.each_with_object([]).each do |primero_module, memo|
      field_stats = init_field_stats(primero_module)
      total_records = Child.where(srch_module_id: primero_module.unique_id).count
      memo << {
        'module_id' => primero_module.unique_id,
        'field_stats' => calculate_field_stats(primero_module, field_stats, total_records),
        'total_records' => total_records
      }
    end
  end

  def calculate_field_stats(primero_module, field_stats, total_records)
    total_fields_by_name = count_record_fields_by_name(primero_module.unique_id)
    field_stats.map do |elem|
      next(elem) unless total_fields_by_name[elem['field'].name].present?

      total = total_fields_by_name[elem['field'].name]
      prevalence = BigDecimal(total, 10) / BigDecimal(total_records, 10)
      elem.merge('total' => total, 'prevalence' => prevalence)
    end
  end

  def init_field_stats(primero_module)
    form_sections = primero_module.form_sections.includes(:fields).where(
      { parent_form: 'case', is_nested: false, visible: true, fields: { visible: true } }
    ).where.not(fields: { type: [Field::SUBFORM, Field::SEPARATOR] }).order('form_sections.order')

    form_sections.each_with_object([]) do |form_section, memo|
      form_section.fields.each do |field|
        memo << { 'field' => field, 'form_section' => form_section, 'total' => 0, 'prevalence' => BigDecimal(0) }
      end
    end
  end

  def count_record_fields_by_name(module_unique_id)
    total_fields_by_name = {}
    Child.where(srch_module_id: module_unique_id).in_batches do |children|
      fields_by_name = Child.connection.select_all(
        children.joins(join_fields_query).select('name, COUNT(*) AS total').group('name')
      ).rows.to_h
      total_fields_by_name = aggregate_field_count(total_fields_by_name, fields_by_name)
    end

    total_fields_by_name
  end

  def aggregate_field_count(prev_statisticts, next_statistics)
    return next_statistics unless prev_statisticts.present?

    next_statistics.entries.each do |(key, value)|
      prev_statisticts[key] = prev_statisticts.key?(key) ? prev_statisticts[key] + value : value
    end

    prev_statisticts
  end

  def join_fields_query
    <<~SQL
      CROSS JOIN LATERAL (
        SELECT
          key AS name
        FROM JSONB_EACH(JSONB_STRIP_NULLS(data))
        WHERE (
          JSONB_TYPEOF(value) <> 'array'
          OR (
            JSONB_TYPEOF(value) = 'array' AND JSONB_ARRAY_LENGTH(value) > 0
          )
        )
      ) AS fields
    SQL
  end

  def default_file_name
    timestamp = Time.now.strftime('%Y%m%d.%M%S%M%L')
    file_name = 'unused_fields_report'

    "#{file_name}_#{timestamp}.xlsx"
  end
end
