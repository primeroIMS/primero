# frozen_string_literal: true

module Exporters

  # Superclass for all Record exporters
  class BaseExporter

    EXPORTABLE_FIELD_TYPES = [
      Field::TEXT_FIELD,
      Field::TEXT_AREA,
      Field::RADIO_BUTTON,
      Field::SELECT_BOX,
      Field::NUMERIC_FIELD,
      Field::DATE_FIELD,
      Field::DATE_RANGE,
      Field::TICK_BOX,
      Field::TALLY_FIELD,
      Field::SUBFORM
    ].freeze

    attr_accessor :locale, :lookups, :fields, :forms

    class << self
      def id
        raise NotImplementedError
      end

      def supported_models
        ApplicationRecord.descendants
      end

      def mime_type
        id
      end

      def excluded_field_names
        Field.binary_fields.pluck(:name)
      end

      # TODO: Deprecate this. Just reject fields.
      def excluded_forms
        []
      end

      def authorize_fields_to_user?
        true
      end

      # This is a class method that does a one-shot export to a String buffer.
      # Don't use this for large data sets.
      def export(*args)
        exporter_obj = new
        exporter_obj.export(*args)
        exporter_obj.complete
        exporter_obj.buffer.string
      end


      # TODO: Make this method generic
      # Used by the ExcelExporter and PDFExporter
      def case_form_sections_by_module(cases, current_user)
        cases.map(&:module).compact.uniq.inject({}) do |acc, mod|
          acc.merge({mod.name => current_user.permitted_forms('case')
                                             .sort {|a, b| [a.order_form_group, a.order] <=> [b.order_form_group, b.order] } })
        end
      end

      # TODO: This should be used by the ExcelExporter
      ## Add other useful information for the report.
      def include_metadata_properties(props, model_class)
        props.each do |pm, fs|
          #TODO: Does order of the special form matter?
          props[pm].merge!(model_class.record_other_properties_form_section)
        end
        return props
      end

      # TODO: Only used by the SelectedFieldsExcelExporter
      def get_model_location_value(model, property)
        Location.ancestor_placename_by_name_and_admin_level(model.send(property.first.try(:name)), property.last[:admin_level].to_i) if property.last.is_a?(Hash)
      end
    end

    def initialize(output_file_path = nil, locale = nil)
      @io = if output_file_path.present?
              File.new(output_file_path, 'w')
            else
              StringIO.new
            end
      self.locale = locale || I18n.locale
    end

    def export(*_args)
      raise NotImplementedError
    end

    def establish_export_constraints(records, user, options = {})
      self.forms = forms_to_export(records, user, options)
      self.fields = fields_to_export(forms, options)
    end

    def model_class(models)
      return unless models.present? && models.is_a?(Array)

      models.first.class
    end

    def export_value(value, field)
      if value.is_a?(Date)
        I18n.l(value)
      elsif value.is_a?(Time)
        I18n.l(value, format: :with_time)
      elsif value.is_a?(Array)
        value.map { |v| export_value(v, field) }
      else
        field&.display_text(value, lookups, locale) || value
      end
    end

    def complete
      (buffer.class == File) && !buffer.closed? && @io.close
    end

    def buffer
      @io
    end

    private

    def forms_to_export(records, user, options = {})
      record_type = model_class(records)&.parent_form
      forms = user.permitted_forms(record_type).includes(:fields)
      return forms unless options[:form_unique_ids].present?

      forms.select { |form| options[:form_unique_ids].include?(form.unique_id) }
    end

    def fields_to_export(forms, options = {})
      fields = forms.map(&:fields).flatten.uniq(&:name)
      reject_these = self.class.excluded_field_names
      fields = fields.reject { |f| reject_these.include?(f.name) } if reject_these.present?
      return fields unless options[:field_names].present?

      # TODO: Don't forget this:
      # user.can?(:write, model_class) ? permitted_fields : permitted_fields.select(&:showable?)
      fields.select { |field| options[:field_names].include?(field.name) }
    end

  end
end