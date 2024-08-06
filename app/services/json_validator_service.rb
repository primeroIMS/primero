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

  # rubocop:disable Metrics/AbcSize
  # rubocop:disable Metrics/MethodLength
  # rubocop:disable Metrics/PerceivedComplexity
  # rubocop:disable Metrics/CyclomaticComplexity
  def as_strong_params(name, object)
    type = [object['type']].flatten
    if type.include?('object')
      if object['properties'].keys.include?('total')
        { name.to_sym => object['properties'].map { |k, v| as_strong_params(k, v) } }
      else
        object['properties'].map { |k, v| as_strong_params(k, v) }
      end
    elsif type.include?('array')
      items_type = [object['items']['type']].flatten
      if items_type.include?('object')
        { name.to_sym => object['items']['properties'].map { |k, v| as_strong_params(k, v) } }
      else
        { name.to_sym => [] }
      end
    else
      name.to_sym
    end
  end
  # rubocop:enable Metrics/CyclomaticComplexity
  # rubocop:enable Metrics/PerceivedComplexity
  # rubocop:enable Metrics/MethodLength
  # rubocop:enable Metrics/AbcSize

  def build_schema(_fields)
    { 'type' => 'object', 'properties' => {}, 'additionalProperties' => false }
  end
end
