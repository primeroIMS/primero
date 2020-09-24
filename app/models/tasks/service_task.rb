# frozen_string_literal: true

module Tasks
  # Class for Service Task
  class ServiceTask < Task
    attr_accessor :service

    def self.from_case(record)
      tasks = []
      if record.services_section.present?
        record.services_section.each do |service|
          tasks << ServiceTask.new(record, service) if task?(record, service)
        end
      end
      tasks.select { |task| task.due_date.present? }
    end

    def self.task?(record, service)
      service['service_implemented_day_time'].blank? && record&.service_due_date(service).present?
    end

    def self.field_name
      'service_appointment_date' if SystemSettings.current&.due_date_from_appointment_date
      'service_response_timeframe'
    end

    def initialize(record, service)
      super(record)
      self.service = service
      self.detail = service['service_type']
    end

    def due_date
      @due_date ||= parent_case.service_due_date(service)
    end

    def type_display(lookups = nil)
      I18n.t("task.types.#{type}",
             subtype: Lookup.display_value('lookup-service-type', service['service_type'], lookups))
    end

    def completion_field
      'service_implemented_day_time'
    end
  end
end
