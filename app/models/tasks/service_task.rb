module Tasks
  class ServiceTask < Task
    attr_accessor :service

    def self.from_case(record)
      tasks = []
      if record.try(:services_section).present?
        record.services_section.each do |service|
          if has_task?(record, service)
            tasks << ServiceTask.new(record, service)
          end
        end
      end
      tasks
    end

    def self.has_task?(record, service)
      service.try(:service_implemented_day_time).blank? &&
      record.try(:service_due_date, service).present?
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
            subtype:  Lookup.display_value('lookup-service-type', service.try(:service_type), lookups))
    end
  end
end
