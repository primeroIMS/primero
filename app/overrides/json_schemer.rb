# frozen_string_literal: true

# Hacking the json_schemer gem to support validations of the params hash with Date and Time variables.
JSONSchemer::Schema::Base.class_eval do
  alias_method :validate_type_old, :validate_type
  def validate_type(instance, type, &block)
    data = instance.data
    case type
    when 'date'
      yield error(instance, type) unless data.is_a?(Date)
    when 'date-time'
      yield error(instance, type) unless data.is_a?(Time)
    else
      validate_type_old(instance, type, &block)
    end
  end
end
