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
    if constraining_fields?
      constrain_fields
    elsif constraining_forms_and_fields?
      constrain_forms_and_fields
    else
      super
    end
    self.forms = constrain_form_fields(forms.to_a + [metadata_form])
  end

  def constraining_fields?
    options[:form_unique_ids].blank? && options[:field_names]
  end

  def constraining_forms_and_fields?
    options[:form_unique_ids] && options[:field_names]
  end

  def constrain_fields
    self.forms = forms_to_export(true)
    self.fields = fields_to_export
    self.forms = [selected_fields_form]
  end

  def constrain_forms_and_fields
    self.forms = forms_to_export(true)
    field_names = fields_to_export.map(&:name)
    self.forms = forms.map { |form| filter_fields(form, field_names) }
    self.forms = forms.select { |f| f.fields.size.positive? }
  end

  def constrain_form_fields(forms)
    forms.map do |form|
      form_dup = duplicate_form(form)
      form_dup.fields = form.fields.reject(&:hide_on_view_page?)
      form_dup
    end
  end

  private

  def filter_fields(form, field_names)
    form_dup = duplicate_form(form)
    form_dup.fields = form.fields.select { |f| field_names.include?(f.name) }
    form_dup
  end

  def selected_fields_form
    form = FormSection.new(unique_id: 'selected_fields', fields:)
    form.send(:name=, I18n.t('exports.selected_xls.selected_fields', locale:), locale)
    form
  end

  def metadata_form
    fields = METADATA_FIELD_NAMES.map do |name|
      field = Field.new(name:, type: Field::TEXT_FIELD)
      field.send(:display_name=, name, locale)
      field
    end
    form = FormSection.new(unique_id: '__record__', fields:)
    form.send(:name=, '__record__', locale)
    form
  end
end
