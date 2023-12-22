# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

require 'write_xlsx'

# Exports selected forms and fields to a multi-tabbed Excel file.
# See the Exporters::ExcelExporter for concerns about the underlying library.
class Exporters::SelectedFieldsExcelExporter < Exporters::ExcelExporter
  METADATA_FIELD_NAMES = %w[
    created_organization created_by_full_name last_updated_at
    last_updated_by last_updated_by_full_name posted_at
    unique_identifier record_state hidden_name
    owned_by_full_name previously_owned_by_full_name
    duplicate duplicate_of
  ].freeze

  class << self
    def id
      'custom'
    end

    def supported_models
      [Child, TracingRequest, Family]
    end

    def mime_type
      'xlsx'
    end
  end

  def establish_export_constraints
    self.export_constraints = Exporters::SelectedFieldsExcelExporterConstraints.new(
      record_type:, user:, excluded_field_names: self.class.excluded_field_names, options:,
      constraining_fields: constraining_fields?, constraining_forms_and_fields: constraining_forms_and_fields?,
      locale:
    )
    export_constraints.generate!
  end

  def establish_record_constraints(record)
    if user.referred_to_record?(record)
      self.record_constraints = Exporters::SelectedFieldsExcelExporterConstraints.new(
        record_type:, user:, excluded_field_names: self.class.excluded_field_names, options:,
        constraining_fields: constraining_fields?, constraining_forms_and_fields: constraining_forms_and_fields?,
        locale:, record:
      )
      record_constraints.generate!
    else
      self.record_constraints = export_constraints
    end
  end

  def constraining_fields?
    options[:form_unique_ids].blank? && options[:field_names].present?
  end

  def constraining_forms_and_fields?
    options[:form_unique_ids].present? && options[:field_names].present?
  end

  def non_permitted_field?(field)
    return false if METADATA_FIELD_NAMES.include?(field.name)

    super(field)
  end
end
