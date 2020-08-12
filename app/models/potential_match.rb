# frozen_string_literal: true

# This virtual model encapsulates a potential link between a trace on a TracingRequest
# and a case (Child). It contains logic for comparing the two records and pass judgement
# on how likely it is that they represent the same person.
class PotentialMatch < ValueObject
  VALUE_MATCH = 'match'
  VALUE_MISMATCH = 'mismatch'
  VALUE_BLANK = 'blank'
  FIELD_CORRESPONDANCE = {
    'nationality' => 'relation_nationality', 'relation_nationality' => 'nationality',
    'language' => 'relation_language', 'relation_language' => 'language',
    'religion' => 'relation_religion', 'relation_religion' => 'religion',
    'ethnicity' => 'relation_ethnicity', 'relation_ethnicity' => 'ethnicity',
    'sub_ethnicity_1' => 'relation_sub_ethnicity1', 'relation_sub_ethnicity1' => 'sub_ethnicity_1',
    'sub_ethnicity_2' => 'relation_sub_ethnicity2', 'relation_sub_ethnicity2' => 'sub_ethnicity_2'
  }.freeze

  attr_accessor :child, :trace, :score, :likelihood, :status, :unique_identifier

  def self.comparable_name_fields
    %w[name name_other name_nickname]
  end

  def case_and_trace_matched?
    trace.matched_case_id == child.id
  end

  def comparison
    case_to_trace = Child.child_matching_field_names.map do |field_name|
      case_to_trace_values(field_name)
    end
    family_matching_field_names = Child.family_matching_field_names
    family_to_inquirer = (child.family_details_section || []).map do |family_member|
      family_matching_field_names.map do |field_name|
        case_to_trace_values(field_name, family_member)
      end
    end
    { case_to_trace: case_to_trace, family_to_inquirer: family_to_inquirer }
  end

  def compare_values(value1, value2)
    return VALUE_BLANK if value1.blank? && value2.blank?
    return VALUE_MATCH if value1 == value2
    return VALUE_MATCH if multivalues_match?(value1, value2)

    VALUE_MISMATCH
  end

  def multivalues_match?(value1, value2)
    value1.respond_to?(:split) &&
      value2.respond_to?(:split) &&
      (value1.split.flatten - value2.split.flatten).blank?
  end

  def case_to_trace_values(field_name, family_member = {})
    case_value = case_value(field_name, family_member)
    trace_value = trace_value(field_name)
    match = compare_values(case_value, trace_value)
    { field_name: field_name, match: match, case_value: case_value, trace_value: trace_value }
  end

  # Try to fetch the value first from the trace then from the tracing request.
  # Some field names correspond, so try those fields
  def trace_value(field_name)
    tracing_request_data = trace.tracing_request.data
    trace.data[field_name] ||
      tracing_request_data[corresponding_field_name(field_name)] ||
      trace.data[corresponding_field_name(field_name)] ||
      tracing_request_data[field_name]
  end

  def case_value(field_name, family_member = {})
    family_member[field_name] ||
      child.data[corresponding_field_name(field_name)] ||
      family_member[corresponding_field_name(field_name)] ||
      child.data[field_name]
  end

  def corresponding_field_name(field_name)
    FIELD_CORRESPONDANCE[field_name] || field_name
  end
end
