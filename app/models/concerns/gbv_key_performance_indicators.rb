# frozen_string_literal: true

# Module for capturing all of the GBV KPI related logic.
module GBVKeyPerformanceIndicators
  extend ActiveSupport::Concern

  included do
    store_accessor :data, :survivor_assessment_form, :safety_plan,
                   :action_plan_form, :client_feedback

    searchable do
      %i[completed_survivor_assessment safety_plan_required completed_safety_plan completed_action_plan
         case_plan_approved duplicate].each { |f| boolean(f) }
      %i[services_provided action_plan_referral_statuses].each { |f| string(f, multiple: true) }
      %i[safety_goals_progress health_goals_progress psychosocial_goals_progress justice_goals_progress
         other_goals_progress].each { |f| float(f) }
      string :satisfaction_status
    end
  end

  delegate :completed_survivor_assessment, :safety_plan_required, :completed_safety_plan,
    :completed_action_plan, :services_provided, :action_plan_referral_statuses, :safety_goals_progress,
    :health_goals_progress, :psychosocial_goals_progress, :justice_goals_progress, :other_goals_progress,
    :satisfaction_status, to: :kpis

  private

  # Return a list of responses for a given form_section unique_id
  def form_responses(form_section_id)
    form_section = FormSection.find_by(unique_id: form_section_id)
    form_section_results = send(form_section_id)

    return FormSectionResponseList.new(responses: [], form_section: nil) unless form_section
    if form_section_results.nil? || form_section_results.empty?
      return FormSectionResponseList.new(responses: [], form_section: form_section)
    end

    FormSectionResponseList.new(responses: form_section_results, form_section: form_section)
  end

  def percentage_goals_met(goals)
    return nil if goals.empty?

    applicable_goals = goals.count { |status| status != 'n_a' }
    return nil if applicable_goals.zero?

    met_goals = goals.count { |status| status == 'met' }
    return 0 if met_goals.zero?

    met_goals / applicable_goals.to_f
  end

  def goal_progress(goal_field)
    # Could maybe use a service object here? Wrap the case object
    # and manually manage creating FormSectionResponseLists.
    percentage_goals_met(
      form_responses(:action_plan_form)
        .subform(:gbv_follow_up_subform_section)
        .field(goal_field)
    )
  end

  def kpis
    @kpis ||= GbvKpiCalculationService.new(self)
  end
end
