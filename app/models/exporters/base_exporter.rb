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

      def excluded_properties
        Field.binary_fields.pluck(:name)
      end

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

      # TODO: This method excludes specific forms and properties named in the exporter.
      # Used by ExcelExporter, PDFExporter, SelectedFieldsExcelExporter
      def properties_to_export(props)
        props = exclude_forms(props) if excluded_forms.present?
        props = props.flatten.uniq
        props = props.reject { |p| excluded_properties.include?(p.name) } if excluded_properties.present?
        props
      end

      def exclude_forms(props)
        return props unless props.is_a?(Hash)

        filtered_props = {}
        props.each do |primero_module, forms|
          forms = forms.to_h.reject do |form_name, _|
            excluded_forms.include?(form_name)
          end
          filtered_props[primero_module] = forms
        end

        filtered_props
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

      # TODO: Only used by the CSV export. Also I think we should stop doing this
      # I don't see this functionality being used.
      # Consider nested subforms either not being exported, or exported to a different CSV document.
      # @param properties: array of CouchRest Model Property instances
      def to_2D_array(models, properties)
        emit_columns = lambda do |props, parent_props=[], &column_generator|
          props.map do |p|
            prop_tree = parent_props + [p]
            if p.type.eql?(Field::SUBFORM) || p.is_multi_select?
              # TODO: This is a hack for CSV export, that causes memory leak
              # 5 is an arbitrary number, and probably should be revisited
              longest_array = 5 #find_longest_array(models, prop_tree)
              (1..(longest_array || 0)).map do |n|
                new_prop_tree = prop_tree.clone + [n]
                if p.type.eql?(Field::SUBFORM)
                  emit_columns.call(p.subform.fields, new_prop_tree, &column_generator)
                else
                  column_generator.call(new_prop_tree)
                end
              end.flatten
            else
              column_generator.call(prop_tree)
            end
          end.flatten
        end

        header_columns = ['id', 'model_type'] + emit_columns.call(properties) do |prop_tree|
          pt = prop_tree.clone
          init = pt.shift.name
          pt.inject(init) do |acc, prop|
            if prop.is_a?(Numeric)
              "#{acc}[#{prop}]"
            else
              "#{acc}#{prop.name}"
            end
          end
        end

        yield header_columns

        models.each do |m|
          # TODO: RENAME Child to Case like we should have done months ago
          model_type = {'Child' => 'Case'}.fetch(m.class.name, m.class.name)
          row = [m.id, model_type] + emit_columns.call(properties) do |prop_tree|
            translate_value(prop_tree, get_value_from_prop_tree(m, prop_tree))
          end

          yield row
        end
      end

      # TODO: Clean this up
      #def find_longest_array(models, prop_tree)
      #  models.map {|m| (get_value_from_prop_tree(m, prop_tree) || []).length }.max
      #end
      # this memoization causes memory leaks and brakes when exporting 10k records
      #memoize :find_longest_array

      # TODO: I think this should go away with the 2D array
      # TODO: axe this in favor of the similar function in the Accessible model
      # concern.  Have to figure out the inheritance tree for the models first
      # so that all exportable models get that method.
      def get_value_from_prop_tree(model, prop_tree)
        prop_tree.inject(model) do |acc, prop|
          if acc.nil?
            nil
          elsif prop.is_a?(Numeric)
            # We use 1-based numbering in the output but arrays in Ruby are
            # still 0-based
            acc[prop - 1]
          else
            acc["data"].present? ? acc["data"][prop.try(:name)] : acc[prop.try(:name)]
          end
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

    def initialize(output_file_path = nil)
      @io = if output_file_path.present?
              File.new(output_file_path, 'w')
            else
              StringIO.new
            end
    end

    def export(*args)
      raise NotImplementedError
    end

    def complete
      (buffer.class == File) && !buffer.closed? && @io.close
    end

    def buffer
      @io
    end
  end
end
