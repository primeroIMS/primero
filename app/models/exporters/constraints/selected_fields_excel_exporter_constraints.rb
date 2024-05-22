# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# Class to generate export constraints for the SelectedFieldExporter
class Exporters::Constraints::SelectedFieldsExcelExporterConstraints < Exporters::Constraints::ExporterConstraints
  attr_accessor :constraining_forms_and_fields, :constraining_fields, :locale

  def generate!
    if constraining_fields
      self.include_subforms = true
      constraint_fields!
    elsif constraining_forms_and_fields
      self.include_subforms = true
      constraint_forms_and_fields!
    else
      super
    end
    self.forms = constraint_form_fields(forms.to_a + [metadata_form])
  end

  def constraint_fields!
    self.forms = forms_to_export
    self.fields = fields_to_export
    self.field_names = fields.map(&:name)
    self.forms = [selected_fields_form]
  end

  def constraint_forms_and_fields!
    self.forms = forms_to_export
    self.field_names = fields_to_export.map(&:name)
    self.forms = forms.map { |form| filter_fields(form, field_names) }.select { |form| form.fields.size.positive? }
  end

  def constraint_form_fields(forms)
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
    fields = Exporters::SelectedFieldsExcelExporter::METADATA_FIELD_NAMES.map do |name|
      field = Field.new(name:, type: Field::TEXT_FIELD)
      field.send(:display_name=, name, locale)
      field
    end
    form = FormSection.new(unique_id: '__record__', fields:)
    form.send(:name=, '__record__', locale)
    form
  end
end
