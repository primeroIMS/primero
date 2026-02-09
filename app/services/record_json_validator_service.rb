# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# Validate if the submitted record data an be described by the Field definitions
class RecordJsonValidatorService < JsonValidatorService
  NUMBER_VALIDATION = { 'type' => %w[integer null], 'minimum' => -2_147_483_648, 'maximum' => 2_147_483_647 }.freeze

  private

  # Building a schema is in inherently complex operation
  # rubocop:disable Metrics/AbcSize
  # rubocop:disable Metrics/CyclomaticComplexity
  # rubocop:disable Metrics/PerceivedComplexity
  # rubocop:disable Metrics/MethodLength
  # rubocop:disable Metrics/BlockLength
  def build_schema(fields, values = {}, subform = false)
    object = { 'type' => 'object', 'properties' => {}, 'additionalProperties' => false }
    return object unless fields.present?

    fields.each_with_object(object) do |field, schema_hash|
      next if field&.form_section&.is_nested? && !subform

      properties = schema_hash['properties']
      case field.type
      when Field::DATE_FIELD
        # Date or DateTime ISO 8601
        # Note: See deviation from JSON Schema: config/initializers/date_time_format.rb
        format = field.date_include_time ? 'date-time' : 'date'
        properties[field.name] = { 'type' => [format, 'string', 'null'], 'format' => format }
      when Field::TICK_BOX
        # Boolean
        properties[field.name] = { 'type' => %w[boolean] }
      when Field::NUMERIC_FIELD
        # Numeric, min and max are Solr limitations
        properties[field.name] = { 'type' => %w[integer null], 'minimum' => -2_147_483_648, 'maximum' => 2_147_483_647 }
      when Field::SELECT_BOX
        properties[field.name] = select_field_schema(field, values[field.name])
      when Field::RADIO_BUTTON
        properties[field.name] = radio_field_schema(field, values[field.name])
      when Field::SUBFORM
        properties[field.name] = {
          'type' => %w[array null], 'items' => with_subform_fields(
            build_schema(field.subform&.fields, values[field.subform&.unique_id] || {}, true)
          )
        }
      when Field::TEXT_FIELD, Field::TEXT_AREA
        properties[field.name] = { 'type' => %w[string null] }
      when Field::TALLY_FIELD
        properties[field.name] = { 'type' => %w[object null], 'properties' => tally_properties(field.tally_i18n) }
      when Field::CALCULATED
        properties[field.name] = { 'type' => %w[integer number string boolean null],
                                   'minimum' => -2_147_483_648,
                                   'maximum' => 2_147_483_647 }
      end
    end
  end
  # rubocop:enable Metrics/AbcSize
  # rubocop:enable Metrics/CyclomaticComplexity
  # rubocop:enable Metrics/PerceivedComplexity
  # rubocop:enable Metrics/MethodLength
  # rubocop:enable Metrics/BlockLength

  def select_field_schema(field, values)
    enum_hash = field.options? ? { 'enum' => values } : {}

    # Array of Strings
    return { 'type' => %w[array null], 'items' => { 'type' => 'string' }.merge(enum_hash) } if field.multi_select

    # Allow null values for single selects
    { 'anyOf' => [{ 'type' => %w[string] }.merge(enum_hash), { 'type' => %w[null] }] }
  end

  def radio_field_schema(field, values)
    enum_hash = field.options? ? { 'enum' => values } : {}
    schemas = [{ 'type' => %w[null] }, { 'type' => %w[string] }.merge(enum_hash)]

    # Permit booleans only if no other values are present
    booleans = field.options? && (values - %w[true false]).blank?
    schemas << { 'type' => %w[boolean] } if booleans

    { 'anyOf' => schemas }
  end

  def with_subform_fields(object_schema)
    object_schema.tap do |schema|
      schema['properties']['_destroy'] = { 'type' => %w[boolean null] }
      schema['properties']['unique_id'] = {
        'type' => 'string', 'format' => 'regex', 'pattern' => PermittedFieldService::UUID_REGEX
      }
    end
  end

  def tally_properties(entries)
    return {} unless entries

    entries.each_with_object({ 'total' => NUMBER_VALIDATION }) do |entry, acc|
      acc[entry['id']] = NUMBER_VALIDATION
    end
  end
end
