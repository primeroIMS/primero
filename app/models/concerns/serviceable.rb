module Serviceable
  extend ActiveSupport::Concern

  #TODO: This will need to be reconciled with the ReportableService object.
  SERVICE_IMPLEMENTED = 'implemented'
  SERVICE_NOT_IMPLEMENTED = 'not_implemented'
  SERVICES_NONE = 'no_services'
  SERVICES_IN_PROGRESS = 'in_progress'
  SERVICES_ALL_IMPLEMENTED = 'all_implemented'

  included do

    store_accessor :data, :consent_for_services, :services_section #TODO: Do we need a services alias for this?

    searchable do
      boolean :consent_for_services
      time :service_due_dates, multiple: true
    end

    before_save :update_implement_field, :mark_referrable_services

    def update_implement_field
      services = self.services_section || []
      services.each do |service|
        if service_implemented?(service)
          service['service_implemented'] = SERVICE_IMPLEMENTED
        elsif service_not_implemented?(service)
          service['service_implemented'] = SERVICE_NOT_IMPLEMENTED
        end
      end
    end

    def services_status
      if self.services_section.present?
        if self.services_section.all? {|s| s['service_implemented'] == SERVICE_IMPLEMENTED}
          SERVICES_ALL_IMPLEMENTED
        elsif self.services_section.any? {|s| s['service_implemented'] == SERVICE_NOT_IMPLEMENTED}
          SERVICES_IN_PROGRESS
        else
          SERVICES_NONE
        end
      else
        SERVICES_NONE
      end
    end

    def service_response_present?
      self.services_section.present? && self.services_section.any? {|s| s['service_response_type'].present?}
    end

    def most_recent_service(status = SERVICE_NOT_IMPLEMENTED)
      if self.services_section.present?
        first_day = Date.new
        self.services_section
          .select {|s| s['service_response_type'].present? && s['service_implemented'] == status}
          .sort_by {|s| s['service_response_day_time'] || first_day}
          .last
      end
    end

    #This method returns nil if object is nil
    def service_field_value(service_object, service_field)
      if service_object.present?
        service_object[service_field]
      end
    end

    def service_due_date(service)
      @system_settings ||= SystemSettings.current
      created_on = service['service_response_day_time']
      timeframe = service['service_response_timeframe']
      appointment_date = service['service_appointment_date']
      appointment_time = appointment_date.try(:end_of_day).try(:strftime, '%H:%M:%S')

      if @system_settings.present?
        if @system_settings.due_date_from_appointment_date && appointment_date
          appointment_date_time = "#{appointment_date} #{appointment_time}"
          DateTime.parse(appointment_date_time)
        elsif created_on && timeframe
          converted_timeframe = convert_time(timeframe)
          converted_timeframe.present? ? created_on + converted_timeframe : nil
        end
      end
    end

    #TODO: Should this be moved to the Serviceable concern?
    def service_due_dates
      # TODO: only use services that is of the type of the current workflow
      reportable_services = self.nested_reportables_hash[ReportableService]
      if reportable_services.present?
        reportable_services.select do |service|
          !service.service_implemented?
        end.map do |service|
          service.service_due_date
        end.compact
      end
    end

    def service_implemented?(service)
      service['service_implemented_day_time'].present? &&
      (service['service_implemented'] != SERVICE_IMPLEMENTED)
    end

    def service_not_implemented?(service)
      service['service_type'].present? &&
      service['service_implemented_day_time'].blank?
    end

    def mark_referrable_services
      return unless services_section_change?

      lookup_service_type = Lookup.find_by(unique_id: 'lookup-service-type')
      services_fields = services_implementing_fields
      enabled_agencies = Agency.enabled.where(unique_id: services_fields[:agencies]).pluck(:unique_id, :services).to_h
      enabled_users = User.enabled.where(user_name: services_fields[:users]).pluck(:user_name, :services).to_h

      services_section.each do |service|
        service['service_is_referrable'] = is_referrable(lookup_service_type, enabled_agencies, enabled_users, service)
      end
    end

    private

    def convert_time(string)
      times = string.split('_')

      if times.size >= 2
        times[0].to_i.send(times[1])
      end
    end

    def services_implementing_fields
      services_section.inject(agencies: [], users: []) do |acc, service|
        agency = service['service_implementing_agency']
        user = service['service_implementing_agency_individual']
        acc[:agencies] << agency if acc[:agencies].exclude?(agency)
        acc[:users] << user if acc[:users].exclude?(user)
        return acc
      end
    end

    def is_referrable(lookup_service_type, enabled_agencies, enabled_users, service)
      service_agency = service['service_implementing_agency']
      service_user = service['service_implementing_agency_individual']
      service_type = service['service_type']

      service_agency.present? && service_user.present? && service_type.present? &&
        lookup_service_type&.contains_option_id?(service_type).present? &&
        enabled_agencies[service_agency].present? && enabled_agencies[service_agency].include?(service_type) &&
        enabled_users[service_user].present? && enabled_users[service_user].include?(service_type)
    end
  end
end
