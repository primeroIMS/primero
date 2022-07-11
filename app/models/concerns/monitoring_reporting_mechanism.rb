# frozen_string_literal: true

# MRM-related model
module MonitoringReportingMechanism
  extend ActiveSupport::Concern

  included do
    searchable do
      string :violation_with_verification_status, multiple: true
    end
  end

  def violation_with_verification_status
    violations.each_with_object([]) do |violation, memo|
      next unless violation.type.present? && violation.ctfmr_verified.present?

      memo << "#{violation.type}_#{violation.ctfmr_verified}"
    end.uniq
  end
end
