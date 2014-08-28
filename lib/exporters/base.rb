
module Exporters
  private

  # @param properties: array of CouchRest Model Property instances
  def self.to_2D_array(models, properties)
    longest_nested_arrays = find_longest_nested_arrays(models, properties)

    header_columns = properties.map do |p|
      if longest_nested_arrays.include? p
        if p.type.include?(CouchRest::Model::Embeddable) && longest_nested_arrays[p] > 0
          (1..longest_nested_arrays[p]).map do |n|
            p.type.properties.map {|subp| "#{p.name}_#{n}_#{subp.name}"}
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
      row = properties.map do |p|
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
end
