# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# Validate if the submitted json data
class JsonValidatorService < ValueObject
  attr_accessor :fields, :schema, :schema_supplement, :schemer

  def initialize(opts = {})
    super(opts)

    self.schema ||= build_schema(fields)
    schema['properties'] = schema['properties'].reverse_merge(schema_supplement) if schema_supplement.present?
    self.schemer ||= JSONSchemer.schema(schema)
  end

  def valid?(json_hash)
    schemer.valid?(json_hash)
  end

  def validate!(json_hash)
    return if valid?(json_hash)

    error = Errors::InvalidRecordJson.new('Invalid Record JSON')
    error.invalid_props = schemer.validate(json_hash).map { |v| v['data_pointer'] }
    raise error
  end

  def strong_params
    as_strong_params(:strong_params, schema)
  end

  private

  def as_strong_params(name, object)
    type = [object['type']].flatten

    return object_properties_to_params(object) if type.include?('object')
    return array_items_to_params(name, object) if type.include?('array')

    name.to_sym
  end

  def build_schema(_fields)
    { 'type' => 'object', 'properties' => {}, 'additionalProperties' => false }
  end

  def object_properties_to_params(object)
    object['properties'].map { |k, v| as_strong_params(k, v) }
  end

  def array_items_to_params(name, object)
    items_type = [object['items']['type']].flatten
    if items_type.include?('object')
      { name.to_sym => object['items']['properties'].map { |k, v| as_strong_params(k, v) } }
    else
      { name.to_sym => [] }
    end
  end
end
