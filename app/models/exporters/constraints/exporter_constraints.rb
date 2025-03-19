# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# Class to generate export constraints
class Exporters::Constraints::ExporterConstraints < ValueObject
  attr_accessor :forms, :fields, :field_names, :record, :record_type, :user,
                :include_subforms, :excluded_field_names, :options, :visible

  def generate!
    self.forms = forms_to_export
    self.fields = fields_to_export
    self.field_names = fields.map(&:name)
  end

  def forms_to_export
    permitted_forms_to_export.map { |form| forms_without_hidden_fields(form) }
  end

  def permitted_forms_to_export
    return authorized_forms_for_record(record) if record.present?

    forms = user.role.permitted_forms(record_type, true, include_subforms)
    return forms unless options[:form_unique_ids].present?

    forms.where(unique_id: options[:form_unique_ids])
  end

  def authorized_forms_for_record(record)
    forms = user.authorized_roles_for_record(record).map do |role|
      permitted_forms = role.permitted_forms(record_type, true, include_subforms)
      next(permitted_forms) unless options[:form_unique_ids].present?

      permitted_forms.where(unique_id: options[:form_unique_ids])
    end

    forms.flatten.uniq(&:unique_id)
  end

  def fields_to_export
    fields = forms.map(&:fields).flatten.reject(&:hide_on_view_page?).uniq(&:name)
    fields -= excluded_field_names.to_a
    return fields if options[:field_names].blank?

    map_fields(options, fields)
  end

  def map_fields(options, fields)
    # TODO: Don't forget this:
    # user.can?(:write, model_class) ? permitted_fields : permitted_fields.select(&:showable?)
    options[:field_names].map { |field_name| find_field(fields, field_name) }.compact
  end

  def find_field(fields, field_name)
    fields.find { |field| field.name == field_name }
  end

  def forms_without_hidden_fields(form)
    form_dup = duplicate_form(form)
    form_dup.fields = form_dup.fields.reject { |field| field.hide_on_view_page? || !field.visible }.map do |field|
      # TODO: This cause N+1
      if field.subform.present? && field.type == Field::SUBFORM
        field.subform = forms_without_hidden_fields(field.subform)
      end

      field
    end
    form_dup
  end

  def duplicate_form(form)
    form_dup = FormSection.new(form.as_json.except('id'))
    form_dup.subform_field = Field.new(form.subform_field.as_json.except('id')) if form.subform_field.present?
    form_dup.fields = duplicate_fields(form_dup, form.fields)
    form_dup
  end

  def duplicate_fields(form_dup, fields)
    fields.map do |field|
      field_dup = Field.new(field.as_json.except('id'))
      field_dup.subform = duplicate_form(field.subform) if field.subform.present?
      field_dup.form_section = form_dup
      field_dup
    end
  end
end
