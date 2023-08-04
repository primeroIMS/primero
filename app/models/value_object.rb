# frozen_string_literal: true

# A variation on a Struct. Subclasses should define attr_accessors.
# Initialize subclasses using a Hash to populate the accessors.
class ValueObject
  def initialize(args = {})
    args.each { |k, v| send("#{k}=", v) if respond_to?("#{k}=") }
  end

  def to_h
    instance_variables.to_h do |var|
      [var.to_s.delete('@'), instance_variable_get(var)]
    end
  end
end
