#TODO - WARNING!!! Currently this concern contains logic / fields specific to Child/Case.
#TODO - Before using this concern in any model other than the Child model, some refactoring will be necessary
module Workflow
  extend ActiveSupport::Concern

  included do
    WORKFLOW_NEW = 'new'
    WORKFLOW_CLOSED = 'closed'
    WORKFLOW_REOPENED = 'reopened'
    WORKFLOW_SERVICE_PROVISION = 'service_provision'

    before_create :set_workflow_new
    before_save :set_workflow

    property :workflow, String, :default => WORKFLOW_NEW

    def set_workflow_new
      self.workflow = WORKFLOW_NEW
    end

    #TODO - WARNING - Case specific code
    def set_workflow
      case self.child_status
        when Record::STATUS_OPEN
          set_workflow_open
        when Record::STATUS_CLOSED
          self.workflow = WORKFLOW_CLOSED
        else
          # Nothing to do
      end
    end

    #TODO - WARNING - Case specific code
    def set_workflow_open
      if self.services_section.present? && self.services_section.any? {|s| s.service_response_type.present?}
        self.workflow = WORKFLOW_SERVICE_PROVISION
      elsif self.case_status_reopened
        self.workflow = WORKFLOW_REOPENED
      end
    end

    def reopened_date
      self.reopened_logs.last.try(:reopened_date) if self.workflow == WORKFLOW_REOPENED
    end
  end
end
