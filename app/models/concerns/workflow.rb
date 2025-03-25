# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# NOTE: Currently this concern contains logic / fields specific to Child/Case.
# Note: This is dependent on the Serviceable concern.  Serviceable must be included before Workflow
# Concern for Workflow
module Workflow
  extend ActiveSupport::Concern

  WORKFLOW_NEW = 'new'
  WORKFLOW_CLOSED = 'closed'
  WORKFLOW_REOPENED = 'reopened'
  WORKFLOW_SERVICE_PROVISION = 'service_provision' # Note, this status is deprecated
  WORKFLOW_SERVICE_IMPLEMENTED = 'services_implemented'
  WORKFLOW_CASE_PLAN = 'case_plan'
  WORKFLOW_ASSESSMENT = 'assessment'

  LOOKUP_RESPONSE_TYPES = 'lookup-service-response-type'
  LOOKUP_WORKFLOW = 'lookup-workflow'

  included do
    store_accessor :data, :workflow
    alias_method :workflow_status, :workflow

    before_create :set_workflow_new
    before_save :calculate_workflow
  end

  def set_workflow_new
    self.workflow ||= WORKFLOW_NEW
  end

  def calculate_workflow
    if status == Record::STATUS_OPEN
      self.workflow = calculate_workflow_open
    elsif status == Record::STATUS_CLOSED
      self.workflow = WORKFLOW_CLOSED
    end
  end

  def calculate_workflow_open
    return WORKFLOW_REOPENED if workflow_case_reopened?

    return WORKFLOW_SERVICE_IMPLEMENTED if workflow_services_implemented?

    if workflow_service_response?
      most_recent_service = self.most_recent_service(Serviceable::SERVICE_NOT_IMPLEMENTED)
      return most_recent_service['service_response_type'] if most_recent_service.present?
    end

    return WORKFLOW_CASE_PLAN if workflow_case_plan?

    return WORKFLOW_ASSESSMENT if workflow_assessment?

    self.workflow
  end

  def workflow_case_reopened?
    (changes_to_save_for_record.key?('case_status_reopened') ||
      changes_to_save_for_record.key?('status')) && case_status_reopened
  end

  def workflow_services_implemented?
    changes_to_save_for_record.key?('services_section') &&
      services_status == Serviceable::SERVICES_ALL_IMPLEMENTED &&
      self.module.use_workflow_service_implemented
  end

  def workflow_service_response?
    changes_to_save_for_record.key?('services_section') &&
      services_section.present?
  end

  def workflow_case_plan?
    changes_to_save_for_record.key?('date_case_plan') &&
      date_case_plan.present? &&
      self.module.use_workflow_case_plan
  end

  def workflow_assessment?
    changes_to_save_for_record.key?('assessment_requested_on') &&
      assessment_requested_on.present? &&
      self.module.use_workflow_assessment
  end

  # Class methods
  module ClassMethods
    def workflow_statuses(primero_module)
      lookups_grouped = Lookup.group_by_unique_id([primero_module.response_type_lookup,
                                                   primero_module.workflow_lookup])

      I18n.available_locales.map do |locale|
        { locale => status_list(locale, primero_module, lookups_grouped) }
      end.inject(&:merge)
    end

    def status_list(locale, primero_module, lookups)
      status_list = []
      status_list << workflow_entry(WORKFLOW_NEW, locale, lookups, primero_module)
      status_list << workflow_entry(WORKFLOW_REOPENED, locale, lookups, primero_module)
      workflow_assessment(status_list, locale, primero_module, lookups)
      workflow_case_plan(status_list, locale, primero_module, lookups)
      status_list += lookups&.[](primero_module.response_type_lookup)&.[](locale.to_s) || []
      workflow_service_implemented(status_list, locale, primero_module)
      status_list << workflow_entry(WORKFLOW_CLOSED, locale, lookups, primero_module)
    end

    def workflow_assessment(status_list, locale, primero_module, lookups)
      return unless primero_module&.use_workflow_assessment

      status_list << workflow_entry(WORKFLOW_ASSESSMENT, locale, lookups, primero_module)
    end

    def workflow_case_plan(status_list, locale, primero_module, lookups)
      return unless primero_module&.use_workflow_case_plan

      status_list << workflow_entry(WORKFLOW_CASE_PLAN, locale, lookups, primero_module)
    end

    def workflow_service_implemented(status_list, locale, primero_module)
      return unless primero_module&.use_workflow_service_implemented

      status_list << workflow_key_value(WORKFLOW_SERVICE_IMPLEMENTED, locale)
    end

    private

    def workflow_key_value(status, locale = I18n.locale)
      {
        'id' => status,
        'display_text' => I18n.t("case.workflow.#{status}", locale:)
      }
    end

    def value_from_lookup(status, lookups, primero_module, locale = I18n.locale)
      lookups&.[](primero_module.workflow_lookup)&.[](locale.to_s)&.find do |lkp|
        lkp['id'] == status
      end
    end

    # TODO: This can be use with the other workflow states (WORKFLOW_NEW, WORKFLOW_REOPENED, WORKFLOW_CLOSED)
    def workflow_entry(status, locale, lookups, primero_module)
      value_from_lookup(status, lookups, primero_module, locale) || workflow_key_value(status, locale)
    end
  end
end
