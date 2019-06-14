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
        if service_implemented?(service)
          service.try(:service_implemented=, SERVICE_IMPLEMENTED)
        elsif service_not_implemented?(service)
          service.try(:service_implemented=, SERVICE_NOT_IMPLEMENTED)
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

    def service_due_date(service)
      @system_settings ||= SystemSettings.current
      created_on = service_value(service, 'service_response_day_time')
      timeframe = service_value(service, 'service_response_timeframe')
      appointment_date = service_value(service, 'service_appointment_date')
      appointment_time = appointment_date.try(:end_of_day).try(:strftime, '%H:%M:%S')

      if @system_settings.present?
        if @system_settings.due_date_from_appointment_date.present?
          if appointment_date.present?
            appointment_date_time = "#{appointment_date} #{appointment_time}"
            DateTime.parse(appointment_date_time)
          end
        elsif created_on.present? && timeframe.present?
          converted_timeframe = convert_time(timeframe)
          converted_timeframe.present? ? created_on + converted_timeframe : nil
        end
      end
    end

    private

    def service_implemented?(service)
      service.try(:service_implemented_day_time).present? &&
      (service.try(:service_implemented) != SERVICE_IMPLEMENTED)
    end

    def service_not_implemented?(service)
      service.try(:service_type).present? &&
      service.try(:service_implemented_day_time).blank?
    end

    def service_value(service, field_name)
      service.send(field_name) if service.present? && service.respond_to?(field_name)
    end

    def convert_time(string)
      times = string.split('_')

      if times.size >= 2
        times[0].to_i.send(times[1])
      end
    end
  end
end
