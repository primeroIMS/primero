
module Exporters
  private

  class BaseExporter
    class << self
      extend Memoist

      public 

      def id
        raise NotImplementedError
      end

      def supported_models
        CouchRest::Model::Base.descendants
      end

      def mime_type
        id
      end

      def excluded_properties
        []
      end

      def properties_to_export(props)
        props.reject {|p| self.excluded_properties.include?(p.name) }
      end

      # @param properties: array of CouchRest Model Property instances
      def to_2D_array(models, properties)
        emit_columns = lambda do |props, parent_props=[], &column_generator|
          props.map do |p|
            prop_tree = parent_props + [p]
            if p.array
              longest_array = find_longest_array(models, prop_tree)
              (1..(longest_array || 0)).map do |n|
                new_prop_tree = prop_tree.clone + [n]
                if p.type.include?(CouchRest::Model::Embeddable)
                  emit_columns.call(p.type.properties, new_prop_tree, &column_generator)
                else
                  column_generator.call(new_prop_tree)
                end
              end.flatten
            else
              if !p.type.nil? && p.type.include?(CouchRest::Model::Embeddable)
                emit_columns.call(p.type.properties, prop_tree, &column_generator)
              else
                column_generator.call(prop_tree)
              end
            end
          end.flatten
        end

        header_columns = ['_id', 'model_type'] + emit_columns.call(properties) do |prop_tree|
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
            get_value_from_prop_tree(m, prop_tree)
          end

          yield row
        end
      end

      def find_longest_array(models, prop_tree)
        models.map {|m| (get_value_from_prop_tree(m, prop_tree) || []).length }.max
      end
      memoize :find_longest_array

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
            acc.send(prop.name.to_sym)
          end
        end
      end

      def convert_model_to_hash(model, properties)
        prop_names = properties.map {|p| p.name}
        JSON.parse(model.to_json).select do |k,v|
          prop_names.include? k
        end.tap do |h|
          h['model_type'] = model.class.name
          h['_id'] = model.id
          h
        end
      end

      #Date field in the index page are displayed with some format
      #and they should be exported using the same format.
      def to_exported_value(value)
        if value.is_a?(Date)
          value.strftime("%d-%b-%Y")
        else
          #Returns original value.
          value
        end
      end
    end
  end
end
