# frozen_string_literal: true

# MRM-related model
module MonitoringReportingMechanism
  extend ActiveSupport::Concern

  included do
    searchable do
      Violation::TYPES.each do |violation_type|
        Violation::VERIFICATION_STATUS.each do |verification_status|
          boolean("#{violation_type}_#{verification_status}") do
            send(:exists_violation_with?, violation_type, verification_status)
          end
        end
      end
    end
  end

  def exists_violation_with?(violation_type, verification_status)
    violations.where(
      "data->>'type' = :type AND data->>'ctfmr_verified' = :ctfmr_verified",
      { type: violation_type, ctfmr_verified: verification_status }
    ).exists?
  end
end
