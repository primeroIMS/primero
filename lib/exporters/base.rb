
module Exporters
  class Export
    attr_accessor :data, :options

    def initialize data, options
      @data = data
      @options = options
    end
  end

  private

  # @param properties: array of CouchRest Model Property instances
  def self.to_2D_array(models, properties)
    require 'pry'; binding.pry

    longest_nested_arrays = find_longest_nested_arrays() 

    header_row = properties.map do |p|
      if longest_nested_arrays.include? p
        if p.type.include? CouchRest::Model::Embeddable
          (0..longest_nested_arrays[p])
          p.type.properties.map {|subp| "#{p.name}_#{subp.name}"}
        end
      end
    end

    yield header_row
  end

  def self.find_longest_nested_arrays(models, properties)
    properties.select {|p| p.array}.inject({}) do |acc, p|
      if p.array
        acc.update({p => models.max_by {|m| m[p.name].length}.length})
      end
    end
  end

  ExportMatrix = Struct.new(:field_names, :data)
end
