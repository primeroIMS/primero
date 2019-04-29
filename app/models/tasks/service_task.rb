module Tasks
  class ServiceTask < Task
    attr_accessor :service

    def self.from_case(record)
      tasks = []
      if record.services_section.present?
        record.services_section.each do |service|
          if has_task?(service)
            tasks << ServiceTask.new(record, service)
          end
        end
      end
      tasks
    end

    def self.has_task?(service)
      #TODO: or should use service['service_implemented'] == Child::SERVICE_NOT_IMPLEMENTED
      service['service_appointment_date'].present? &&
      !service['service_implemented_day_time'].present?
    end

    def initialize(record, service)
      super(record)
      self.service = service
    end

    def due_date
      @due_date ||= self.parent_case.service_due_date(self.service)
    end

    def type_display(lookups=nil)
      I18n.t("task.types.#{self.type}",
            subtype:  Lookup.display_value('lookup-service-type', service['service_type'], lookups))
    end
  end
end
