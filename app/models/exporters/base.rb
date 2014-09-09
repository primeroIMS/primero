
module Exporters
  private

  class BaseExporter
    def self.id
      raise NotImplementedError
    end

    def self.supported_models
      CouchRest::Model::Base.descendants
    end

    def self.mime_type
      self.id
    end
  end

  # @param properties: array of CouchRest Model Property instances
  # TODO: Rework to be more recursive to handle violations
  def self.to_2D_array(models, properties)

    def emit_columns(props, context=nil, &column_generator)

      props.map do |p|
        longest_arrays = find_longest_array(models, parent_props[p])
        if longest_arrays.include? p
          if p.array && longest_arrays[p] > 0
            (1..longest_arrays[p]).map do |n|
              new_context = context.deeper_merge({:parent_props => [p], :n => [n]})
              if p.type.include?(CouchRest::Model::Embeddable)
                emit_columns(p.type.properties, new_context, column_generator)
              else
                yield(p, new_context)
              end
            end.flatten
          else
            []
          end
        else
          yield(p, context)
        end
      end.flatten
    end

    header_columns = ['model_type'] + emit_columns(properties) do |prop, context|
      if context[:n].is_a?(Array)
        ns = context[:n]
        init = prop.array ? "#{prop.name}[#{n.pop}]" : prop.name
        (context[:parent_props] || []).reverse.inject(init) {|acc, pp| "#{pp.name}[#{ns.pop}]#{acc}"}
      else
        prop.name
      end
    end

    yield header_columns

    models.each do |m|
      row = [m.class.name] + emit_columns(properties, {:model => m}) do |prop, context|
        if prop.array
          if prop.type.include?(CouchRest::Model::Embeddable) && context[prop.name].length > 0
            prop.type.properties
              emit_columns(context.send(prop.name.to_sym), n, 
            end.flatten
          else
          end
        else
          context.send(prop.name.to_sym)
        end
      end

      yield row
    end
  end

  def self.find_longest_arrays(models, properties)
    properties.select {|p| p.array}.inject({}) do |acc, p|
      if p.array
        acc.update({p => models.map {|m| m.send(p.name.to_sym).length}.max})
      end
    end
  end

  def self.convert_model_to_hash(model, properties)
    prop_names = properties.map {|p| p.name}
    JSON.parse(model.to_json).select do |k,v|
      prop_names.include? k
    end.tap do |h|
      h['model_type'] = model.class.name
      h
    end
  end
end
