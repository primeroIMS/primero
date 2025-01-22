# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# Concern for services
# rubocop:disable Metrics/ModuleLength
module Serviceable
  extend ActiveSupport::Concern

  # TODO: This will need to be reconciled with the ReportableService object.
  SERVICE_IMPLEMENTED = 'implemented'
  SERVICE_NOT_IMPLEMENTED = 'not_implemented'
  SERVICES_NONE = 'no_services'
  SERVICES_IN_PROGRESS = 'in_progress'
  SERVICES_ALL_IMPLEMENTED = 'all_implemented'

  # rubocop:disable Metrics/BlockLength
  included do
    store_accessor :data, :consent_for_services, :services_section, # TODO: Do we need a services alias for this?
                   :service_due_dates, :service_implemented_day_times

    before_save :update_implement_field
    before_save :calculate_service_due_dates
    before_save :calculate_service_implemented_day_times

    def update_implement_field
      services_section&.each do |service|
        if service_implemented?(service)
          service['service_implemented'] = SERVICE_IMPLEMENTED
        elsif service_not_implemented?(service)
          service['service_implemented'] = SERVICE_NOT_IMPLEMENTED
        end
      end
    end

    def services_status
      return SERVICES_NONE if services_section.blank?

      return SERVICES_ALL_IMPLEMENTED if all_implemented?

      return SERVICES_IN_PROGRESS if any_not_implemented?

      SERVICES_NONE
    end

    def all_implemented?
      services_section.all? { |s| s['service_implemented'] == SERVICE_IMPLEMENTED }
    end

    def any_not_implemented?
      services_section.any? { |s| s['service_implemented'] == SERVICE_NOT_IMPLEMENTED }
    end

    def service_response_present?
      services_section.present? && services_section.any? { |s| s['service_response_type'].present? }
    end

    def most_recent_service(status = SERVICE_NOT_IMPLEMENTED)
      return if services_section.blank?

      first_day = Date.new
      services_section
        .select { |s| s['service_response_type'].present? && s['service_implemented'] == status }
        .max_by { |s| s['service_response_day_time'] || first_day }
    end

    # This method returns nil if object is nil
    def service_field_value(service_object, service_field)
      service_object[service_field] if service_object.present?
    end

    def service_due_date(service)
      @system_settings ||= SystemSettings.current
      return if @system_settings.blank?

      created_on = service['service_response_day_time']
      timeframe = service['service_response_timeframe']
      appointment_date = service['service_appointment_date']
      appointment_time = appointment_date.try(:end_of_day).try(:strftime, '%H:%M:%S')

      if @system_settings.due_date_from_appointment_date && appointment_date
        return due_date_from_appointment_date(appointment_date, appointment_time)
      end

      created_on && timeframe ? converted_timeframe(created_on, timeframe) : nil
    end

    def due_date_from_appointment_date(appointment_date, appointment_time)
      appointment_date_time = "#{appointment_date} #{appointment_time}"
      DateTime.parse(appointment_date_time)
    end

    def converted_timeframe(created_on, timeframe)
      converted_timeframe = convert_time(timeframe)
      converted_timeframe.present? ? created_on + converted_timeframe : nil
    end

    # TODO: Should this be moved to the Serviceable concern?
    def calculate_service_due_dates
      # TODO: only use services that is of the type of the current workflow
      reportable_services = nested_reportables_hash[ReportableService]
      if reportable_services.present?
        self.service_due_dates = reportable_services.reject(&:service_implemented?).map(&:service_due_date).compact.uniq
      end

      service_due_dates
    end

    def calculate_service_implemented_day_times
      self.service_implemented_day_times = services_section&.map do |service|
        service['service_implemented_day_time']
      end&.compact&.uniq

      service_implemented_day_times
    end

    def service_implemented?(service)
      service['service_implemented_day_time'].present? &&
        (service['service_implemented'] != SERVICE_IMPLEMENTED)
    end

    def service_not_implemented?(service)
      service['service_type'].present? &&
        service['service_implemented_day_time'].blank?
    end

    def services_section_change?
      hash_diff(data_change[1], data_change[0]).to_h['services_section'].present?
    end

    def services_section_added?
      from = changes_to_save_for_record['services_section']&.first
      to = changes_to_save_for_record['services_section']&.last
      return false if to.blank?
      return true if from.blank? && to.present?

      to.size > from.size
    end

    private

    def convert_time(string)
      times = string.split('_')

      times[0].to_i.send(times[1]) if times.size >= 2
    end
  end
  # rubocop:enable Metrics/BlockLength
end
# rubocop:enable Metrics/ModuleLength
