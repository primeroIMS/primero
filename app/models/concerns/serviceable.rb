require 'chronic'

module Serviceable
  extend ActiveSupport::Concern

  #TODO: This will need to be reconciled with the ReportableService object.
  #      Since we are hardcoding everything, we may as well define it as an
  #      explicit nested CouchRestRails object with explicit properties.

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
        if service.try(:service_implemented_day_time) && service.try(:service_implemented) != SERVICE_IMPLEMENTED
          service.try(:service_implemented=, SERVICE_IMPLEMENTED)
        else
          if service.try(:service_type)
            service.try(:service_implemented=, SERVICE_NOT_IMPLEMENTED)
          end
        end
      end
    end

    def services_status
      if self.services_section.present?
        if self.services_section.all? {|s| s.try(:service_implemented) == SERVICE_IMPLEMENTED}
          SERVICES_ALL_IMPLEMENTED
        elsif self.services_section.any? {|s| s.try(:service_implemented) == SERVICE_NOT_IMPLEMENTED}
          SERVICES_IN_PROGRESS
        else
          SERVICES_NONE
        end
      else
        SERVICES_NONE
      end
    end

    def service_response_present?
      self.services_section.present? && self.services_section.any? {|s| s.try(:service_response_type).present?}
    end

    def most_recent_service(status = SERVICE_NOT_IMPLEMENTED)
      if self.services_section.present?
        first_day = Date.new
        self.services_section
          .select {|s| s.try(:service_response_type).present? && s.try(:service_implemented) == status}
          .sort_by {|s| s.try(:service_response_day_time) || first_day}
          .last
      end
    end
  end
end
