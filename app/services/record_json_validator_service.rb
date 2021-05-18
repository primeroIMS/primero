# frozen_string_literal: true

# Validate if the submitted record data an be described by the Field definitions
class RecordJsonValidatorService < ValueObject
  attr_accessor :fields, :schema, :schemer

  def initialize(opts = {})
    super(opts)
    return unless fields

    self.schema ||= build_schema(fields)
    self.schemer ||= JSONSchemer.schema(schema)
  end

  # TODO: Defenisve coding, what if fields is nil?
  def build_schema(fields)
    # TODO: Consider adding: 'additionalProperties' => false
    # TODO: Consider enumerating hardcoded fields and field types
    object = { 'type' => 'object', 'properties' => {} }
    fields.each_with_object(object) do |field, schema_hash|
      properties = schema_hash['properties']
      case field.type
      when Field::DATE_FIELD
        # Date or DateTime ISO 8601
        format = field.date_include_time ? 'date-time' : 'date'
        properties[field.name] = { 'type' => %w[string null], 'format' => format }
      when Field::TICK_BOX
        # Boolean
        properties[field.name] = { 'type' => %w[boolean] }
      when Field::NUMERIC_FIELD
        # Numeric
        properties[field.name] = { 'type' => %w[integer null], 'minimum' => -2_147_483_648, 'maximum' => 2_147_483_647 }
      when Field::SELECT_BOX
        # TODO: Consider validating enums
        properties[field.name] = if field.multi_select
                                   # Array of Strings
                                   { 'type' => %w[array null], 'items' => { 'type' => 'string' } }
                                 else
                                   # String
                                   { 'type' => %w[string null] }
                                 end
      when Field::SUBFORM
        # Array of objects and recurse
        # TODO: Defensive coding, what if subform is nil?
        properties[field.name] = { 'type' => %w[array null], 'items' => build_schema(field.subform.fields) }
      when Field::TEXT_FIELD, Field::TEXT_AREA
        # String
        properties[field.name] = { 'type' => %w[string null] }
      end
    end
  end

  def valid?(json_hash)
    schemer.valid?(json_hash)
  end

  def validate!(json_hash)
    return if valid?(json_hash)

    raise Errors::InvalidRecordJson
  end
end
