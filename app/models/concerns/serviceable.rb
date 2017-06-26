module Serviceable
  extend ActiveSupport::Concern

  included do
    SERVICE_IMPLEMENTED = 'implemented'
    SERVICE_NOT_IMPLEMENTED = 'not_implemented'
    SERVICES_NONE = 'no_services'
    SERVICES_IN_PROGRESS = 'in_progress'
    SERVICES_ALL_IMPLEMENTED = 'all_implemented'

    before_save :update_implement_field

    def update_implement_field
      services = self.services_section || []
      services.each do |service|
        if service.try(:service_implemented_day_time) && service.service_implemented != SERVICE_IMPLEMENTED
          service.service_implemented = SERVICE_IMPLEMENTED
        else
          if service.try(:service_type)
            service.service_implemented = SERVICE_NOT_IMPLEMENTED
          end
        end
      end
    end

    def services_status
      if self.services_section.present?
        if self.services_section.all? {|s| s.service_implemented == SERVICE_IMPLEMENTED}
          SERVICES_ALL_IMPLEMENTED
        elsif self.services_section.any? {|s| s.service_implemented == SERVICE_NOT_IMPLEMENTED}
          SERVICES_IN_PROGRESS
        else
          SERVICES_NONE
        end
      else
        SERVICES_NONE
      end
    end

    def service_response_present?
      self.services_section.present? && self.services_section.any? {|s| s.service_response_type.present?}
    end

    def most_recent_service(status = SERVICE_NOT_IMPLEMENTED)
      if self.services_section.present?
        # TODO: This doesn't work and is wrong
        self.services_section.select {|s| s.service_implemented == status}.last
      end
    end

  end
end
