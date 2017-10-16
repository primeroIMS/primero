#Note: Currently this concern contains logic / fields specific to Child/Case.
#Note: This is dependent on the Serviceable concern.  Serviceable must be included before Workflow
module Workflow
  extend ActiveSupport::Concern

  included do
    WORKFLOW_NEW = 'new'
    WORKFLOW_CLOSED = 'closed'
    WORKFLOW_REOPENED = 'reopened'
    WORKFLOW_SERVICE_PROVISION = 'service_provision'
    WORKFLOW_SERVICE_IMPLEMENTED = 'services_implemented'
    WORKFLOW_CASE_PLAN = 'case_plan'
    WORKFLOW_ASSESSMENT = 'assessment'

    before_create :set_workflow_new
    before_save :calculate_workflow

    property :workflow, String, :default => WORKFLOW_NEW
    alias_method :workflow_status, :workflow

    def set_workflow_new
      self.workflow = WORKFLOW_NEW
    end

    def workflow_sequence_strings(lookups=nil)
      #TODO: move the logic to a class method and have this method just pull out the open/reopen?
      sequence = []
      if self.case_status_reopened.present?
        sequence << workflow_key_value(WORKFLOW_REOPENED)
      else
        sequence << workflow_key_value(WORKFLOW_NEW)
      end
      if self.module.use_workflow_assessment?
        sequence << workflow_key_value(WORKFLOW_ASSESSMENT)
      end
      if self.module.use_workflow_case_plan?
        sequence << workflow_key_value(WORKFLOW_CASE_PLAN)
      end
      sequence += Lookup.values_for_select('lookup-service-response-type', lookups)
      if self.module.use_workflow_service_implemented?
        #sequence << workflow_key_value(WORKFLOW_SERVICE_IMPLEMENTED)
        sequence << [I18n.t("case.workflow.service_implemented"), WORKFLOW_SERVICE_IMPLEMENTED]
      end
      closed_text = Lookup.display_value('lookup-case-status', Record::STATUS_CLOSED, lookups)
      sequence << [closed_text, Record::STATUS_CLOSED]
      return sequence
    end

    def calculate_workflow
      if self.child_status == Record::STATUS_OPEN
        if workflow_case_reopened?
          self.workflow = WORKFLOW_REOPENED
        elsif workflow_services_implemented?
          self.workflow = WORKFLOW_SERVICE_IMPLEMENTED
        elsif workflow_service_response?
          most_recent_service = self.most_recent_service(Serviceable::SERVICE_NOT_IMPLEMENTED)
          if most_recent_service.present?
            self.workflow = most_recent_service.try(:service_response_type)
          end
        elsif workflow_case_plan?
          self.workflow = WORKFLOW_CASE_PLAN
        elsif workflow_assessment?
          self.workflow = WORKFLOW_ASSESSMENT
        end
      elsif self.child_status == Record::STATUS_CLOSED
        self.workflow = WORKFLOW_CLOSED
      end
    end

    def workflow_case_reopened?
      self.changed.include?('case_status_reopened') &&
      self.case_status_reopened
    end

    def workflow_services_implemented?
      self.changed.include?('services_section') &&
      self.services_status == Serviceable::SERVICES_ALL_IMPLEMENTED &&
      self.module.use_workflow_service_implemented?
    end

    def workflow_service_response?
      self.changed.include?('services_section') &&
      self.services_section.present?
    end

    def workflow_case_plan?
      self.changed.include?('date_case_plan') &&
      self.try(:date_case_plan).present? &&
      self.module.use_workflow_case_plan?
    end

    def workflow_assessment?
      self.changed.include?('assessment_requested_on') &&
      self.try(:assessment_requested_on).present? &&
      self.module.use_workflow_assessment?
    end

    private

    def workflow_key_value(status)
      [I18n.t("case.workflow.#{status}"), status]
    end

  end
end
