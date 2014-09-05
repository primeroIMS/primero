
module Exporters
  private

  # @param properties: array of CouchRest Model Property instances
  # TODO: Rework to be more recursive to handle violations
  def self.to_2D_array(models, properties)
    longest_nested_arrays = find_longest_nested_arrays(models, properties)

    header_columns = ['model_type'] + properties.map do |p|
      if longest_nested_arrays.include? p
        if p.type.include?(CouchRest::Model::Embeddable) && longest_nested_arrays[p] > 0
          (1..longest_nested_arrays[p]).map do |n|
            p.type.properties.map {|subp| "#{p.name}[#{n}]#{subp.name}"}
          end.flatten
        else
          []
        end
      else
        p.name
      end
    end.flatten

    yield header_columns

    models.each do |m|
      row = [m.class.name] + properties.map do |p|
        if !p.type.nil? && p.type.include?(CouchRest::Model::Embeddable) && m[p.name].length > 0
          m.send(p.name.to_sym).map do |elm|
            p.type.properties.map do |subp|
              elm.send(subp.name.to_sym)
            end
          end.flatten
        else
          m.send(p.name.to_sym)
        end
      end.flatten

      yield row
    end
  end

  def self.find_longest_nested_arrays(models, properties)
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
