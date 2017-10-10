#TODO - WARNING!!! Currently this concern contains logic / fields specific to Child/Case.
#TODO - Before using this concern in any model other than the Child model, some refactoring will be necessary
#WARNING - This is dependent on the Serviceable concern.  Serviceable must be included before Workflow
module Workflow
  extend ActiveSupport::Concern

  included do
    WORKFLOW_NEW = 'new'
    WORKFLOW_CLOSED = 'closed'
    WORKFLOW_REOPENED = 'reopened'
    WORKFLOW_SERVICE_PROVISION = 'service_provision'
    WORKFLOW_SERVICE_IMPLEMENTED = 'services_implemented'
    WORKFLOW_CASE_PLAN = 'case_plan'

    before_create :set_workflow_new
    before_save :set_workflow

    property :workflow, String, :default => WORKFLOW_NEW

    def workflow_status
      if (self.workflow == WORKFLOW_SERVICE_PROVISION) && self.services_section.present?
        most_recent_service = self.most_recent_service(Serviceable::SERVICE_NOT_IMPLEMENTED)
        if most_recent_service.present?
          most_recent_service.try(:service_response_type)
        end
      else
        self.workflow
      end
    end

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
    # If there are in progress services, the status is based on the service status
    # UNLESS the case has been reopened
    # If the case has been reopened, the status is based on what has happend most recently: the reopen or a new service
    def set_workflow_open
      case self.services_status
        when Serviceable::SERVICES_IN_PROGRESS
          self.workflow = is_reopened_most_recent?(Serviceable::SERVICE_NOT_IMPLEMENTED) ? WORKFLOW_REOPENED : WORKFLOW_SERVICE_PROVISION
        when Serviceable::SERVICES_ALL_IMPLEMENTED
          self.workflow = is_reopened_most_recent?(Serviceable::SERVICE_IMPLEMENTED) ? WORKFLOW_REOPENED : WORKFLOW_SERVICE_IMPLEMENTED
        else
          self.workflow = WORKFLOW_CASE_PLAN if self.date_case_plan_initiated.present? && self.module.display_case_plan_in_stepper
          self.workflow = WORKFLOW_REOPENED if self.case_status_reopened
      end
    end

    # REOPENED status is used only if it is the most recent thing that happened
    # Otherwise, the most recent service determines the status
    def is_reopened_most_recent?(status)
      if self.case_status_reopened
        most_recent_service = self.most_recent_service(status)
        service_date = most_recent_service.try(:service_response_day_time)
        (service_date.present? && service_date.is_a?(DateTime)) ? (self.reopened_date > service_date) : true
      else
        false
      end
    end
  end
end
