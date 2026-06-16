# frozen_string_literal: true

# Encapsulate field mapping configurations. Used in SystemSetting
# eg. UNHCR field mapping
# TODO: This may be deprecated
class Mapping < ValueObject
  attr_accessor :mapping, :autocalculate

  def initialize(args = {})
    super(args)
    self.mapping ||= {}
    self.autocalculate ||= false
  end
end
