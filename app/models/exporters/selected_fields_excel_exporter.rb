# frozen_string_literal: true

require 'writeexcel'

module Exporters
  # Exports selected forms and fields to a multi-tabbed Excel file.
  # See the Exporters::ExcelExporter for concerns about the underlying library.
  class SelectedFieldsExcelExporter < ExcelExporter
    METADATA_FIELD_NAMES = %w[
      created_organization created_by_full_name last_updated_at
      last_updated_by last_updated_by_full_name posted_at
      unique_identifier record_state hidden_name
      owned_by_full_name previously_owned_by_full_name
      duplicate duplicate_of
    ].freeze

    class << self
      def id
        'selected_xls'
      end

      def supported_models
        [Child, TracingRequest]
      end

      def excluded_forms
        FormSection.binary_form_names
      end

      def mime_type
        'xls'
      end
    end

    def establish_export_constraints(records, user, options)
      if constraining_fields?(options)
        constrain_fields(records, user, options)
      elsif constraining_forms_and_fields?(options)
        constrain_forms_and_fields(records, user, options)
      else
        super(records, user, options)
      end
      self.fields << metadata_form
    end

    def constraining_fields?(options)
      options[:form_unique_ids].blank? && options[:field_names]
    end

    def constraining_forms_and_fields?(options)
      options[:form_unique_ids] && options[:field_names]
    end

    def constrain_fields(records, user, options)
      forms = forms_to_export(records, user)
      fields = fields_to_export(forms, options)
      self.forms = [selected_fields_form(fields)]
    end

    def constrain_forms_and_fields(records, user, options)
      forms = forms_to_export(records, user)
      field_names = fields_to_export(forms, options).map(&:name)
      forms.each do |form|
        fields = form.fields.select { |f| field_names.include?(f.name) }
        form.fields = fields
      end
      forms = forms.select { |f| f.field.size.positive? }
      self.forms = forms
    end

    private

    def selected_fields_form(fields)
      form = FormSection.new(
        unique_id: 'selected_fields',
        fields: fields
      )
      form.send(:name=, I18n.t('exports.selected_xls.selected_fields', locale), locale)
      form
    end

    def metadata_form
      fields = METADATA_FIELD_NAMES.map do |name|
        field = Field.new(name: name, type: Field::TEXT_FIELD)
        field.send(:display_name=, name, locale)
        field
      end
      form = FormSection.new(unique_id: '__record__', fields: fields)
      form.send(:name=, '__record__', locale)
    end
  end
end
