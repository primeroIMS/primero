# frozen_string_literal: true

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

  private

  def build_schema(_fields)
    { 'type' => 'object', 'properties' => {}, 'additionalProperties' => false }
  end
end
