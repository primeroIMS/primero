module Api::V2
  class KeyPerformanceIndicatorsController < ApplicationApiController
    # This is only temporary to avoid double render errors while developing.
    # I looks like this method wouldn't make sense for the audit log to
    # write given that 'write_audit_log' required a record type, id etc.
    # This response doesn't utilize any type of record yet and so cannot
    # provide this information.
    skip_after_action :write_audit_log

    def number_of_cases
    end

    def number_of_incidents
    end

    def reporting_delay
    end

    def service_access_delay
    end

    def assessment_status
    end
  end
end
