# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# Description of PropertyEvaluator class
class PropertyEvaluator
  # 'record' is any Ruby object instance that is to be evualuated
  # 'expression' is a naive pseudo-ruby mehod chain that is evaluted on the record object
  # eg. "created_by_user.location.admin('district').location_code"
  def self.evaluate(record, expression)
    return unless expression.present?

    expression.split('.').reduce(record) do |acc, particle|
      calculate_property(acc, calculate_particles(particle), expression)
    end
  end

  def self.calculate_particles(particle)
    if particle.match(/^[\w?]*\(.*\)$/)
      [particle.split('(').first] + particle[0..-2].split('(').last.split(',')
    else
      [particle]
    end
  end

  def self.calculate_property(acc, particles, expression)
    property = acc.try(*particles)
    property ||= acc.data[particles[0]] if acc.respond_to?(:data) && (particles.size == 1)
    property = property.strftime('%Y%m%d') if property.methods.include?(:strftime) && !expression.include?('strftime')
    property
  end
end
