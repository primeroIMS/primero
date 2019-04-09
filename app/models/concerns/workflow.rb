#Note: Currently this concern contains logic / fields specific to Child/Case.
#Note: This is dependent on the Serviceable concern.  Serviceable must be included before Workflow
module Workflow
  extend ActiveSupport::Concern

  included do
    WORKFLOW_NEW = 'new'
    WORKFLOW_CLOSED = 'closed'
    WORKFLOW_REOPENED = 'reopened'
    WORKFLOW_SERVICE_PROVISION = 'service_provision' #Note, this status is deprecated
    WORKFLOW_SERVICE_IMPLEMENTED = 'services_implemented'
    WORKFLOW_CASE_PLAN = 'case_plan'
    WORKFLOW_ASSESSMENT = 'assessment'

    store_accessor :data, :workflow
    alias_method :workflow_status, :workflow

    searchable auto_index: self.auto_index? do
      string :workflow_status, as: 'workflow_status_sci'
      string :workflow, as: 'workflow_sci'
    end

    before_create :set_workflow_new
    before_save :calculate_workflow

    def set_workflow_new
      self.workflow = WORKFLOW_NEW
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
            self.workflow = most_recent_service['service_response_type']
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
      (self.changes_to_save_for_record.key?('case_status_reopened') ||
       self.changes_to_save_for_record.key?('child_status')) &&
      self.case_status_reopened
    end

    def workflow_services_implemented?
      self.changes_to_save_for_record.key?('services_section') &&
      self.services_status == Serviceable::SERVICES_ALL_IMPLEMENTED &&
      self.module.use_workflow_service_implemented
    end

    def workflow_service_response?
      self.changes_to_save_for_record.key?('services_section') &&
      self.services_section.present?
    end

    def workflow_case_plan?
      self.changes_to_save_for_record.key?('date_case_plan') &&
      self.date_case_plan.present? &&
      self.module.use_workflow_case_plan
    end

    def workflow_assessment?
      self.changes_to_save_for_record.key?('assessment_requested_on') &&
      self.assessment_requested_on.present? &&
      self.module.use_workflow_assessment
    end

    def workflow_sequence_strings(lookups=nil)
      status_list = self.class.workflow_statuses([self.module], lookups)
      if self.case_status_reopened.present?
        status_list.reject! {|status| status['id'] == WORKFLOW_NEW}
      else
        status_list.reject! {|status| status['id'] == WORKFLOW_REOPENED}
      end
      status_list.map {|status| [status['display_text'], status['id']]}
    end
  end

  module ClassMethods
    def workflow_statuses(modules=[], lookups=nil)
      status_list = []
      status_list << workflow_key_value(WORKFLOW_NEW)
      status_list << workflow_key_value(WORKFLOW_REOPENED)
      status_list << workflow_key_value(WORKFLOW_ASSESSMENT) if modules.try(:any?) {|m| m.use_workflow_assessment}
      status_list << workflow_key_value(WORKFLOW_CASE_PLAN) if modules.try(:any?) {|m| m.use_workflow_case_plan}
      status_list += Lookup.values('lookup-service-response-type', lookups, locale: I18n.locale)
      status_list << workflow_key_value(WORKFLOW_SERVICE_IMPLEMENTED) if modules.try(:any?) {|m| m.use_workflow_service_implemented}
      status_list << workflow_key_value(WORKFLOW_CLOSED)
      status_list
    end

    private

    #TODO - concept of 'display_text' would fit better in a helper
    def workflow_key_value(status)
      {'id' => status, 'display_text' => I18n.t("case.workflow.#{status}")}
    end
  end
end
