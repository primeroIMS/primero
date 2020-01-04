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

    attr_accessor :locale

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

      # TODO: Consider unifying the logic with what's in the record controllers
      # Do we need to operate on fields? (:showable?)
      def permitted_fields_to_export(user, record_type)
        permitted_fields = user.permitted_fields(record_type)
        model_class = Record.model_from_name(record_type)
        user.can?(:write, model_class) ? permitted_fields : permitted_fields.select(&:showable?)
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

      # TODO: This method is unused. Delete?
      def properties_to_keys(props)
        #This flattens out the properties by modules by form,
        # while maintaining form order and discarding dupes
        if props.present?
          if props.is_a?(Hash)
            props.reduce({}) do |acc1, primero_module|
              hash = primero_module[1].reduce({}) do |acc2, form|
                acc2.merge(form[1])
              end
              acc1.merge(hash)
            end.values
          else
            props
          end
        else
          []
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

      # TODO: This method is unused
      def current_model_class(models)
        if models.present? && models.is_a?(Array)
          models.first.class
        end
      end

      # TODO: This is only used by the CSVListExporter.
      # TODO: Combine with translation
      # Date field in the index page are displayed with some format
      # and they should be exported using the same format.
      def to_exported_value(value)
        if value.is_a?(Date)
          I18n.l(value)
        elsif value.is_a?(Time)
          I18n.l(value, format: :with_time)
        else
          value
        end
      end

      # TODO: Only used in ExcelExporter, SelectedFieldsExcelExporter
      # TODO: Combine with the date localization above
      def get_model_value(model, property)
        exclude_name_mime_types = ['xls', 'csv', 'selected_xls']
        if property.name == 'name' && model.try(:module_id) == PrimeroModule::GBV && exclude_name_mime_types.include?(id)
          "*****"
        else
          value = model.respond_to?(:data) ? model.data[property.name] : model[property.name]
          translate_value(property, value)
        end
      end

      def map_field_to_translated_value(field, value)
        if field.present? && [Field::RADIO_BUTTON, Field::SELECT_BOX, Field::TICK_BOX].include?(field.type)
          if value.is_a?(Array)
            value.map{|v| field.display_text(v) }
          else
            field.display_text(value)
          end
        else
          to_exported_value(value)
        end
      end

      def translate_value(fields, value)
        field = fields.is_a?(Array) ? fields.first : fields
        if field.present? && field.is_a?(Field)
           if fields.is_a?(Array) && field.type == Field::SUBFORM
            field_names = fields.map{|pn| pn.try(:name)}
            sub_fields = field.subform_section.try(:fields)
            sub_field = sub_fields.select{|sf| field_names.include?(sf.name)}.first
            map_field_to_translated_value(sub_field, value)
          else
            map_field_to_translated_value(field, value)
          end
        else
          value
        end
      end

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

    def export(*args)
      raise NotImplementedError
    end

    # Filter out any fields that are inappropriate to the exporter.
    def fields_to_export(fields)
      reject_these = self.class.excluded_field_names
      return fields unless reject_these.present?

      fields.reject { |f| reject_these.include?(f.name) }
    end

    def complete
      (buffer.class == File) && !buffer.closed? && @io.close
    end

    def buffer
      @io
    end
  end
end
