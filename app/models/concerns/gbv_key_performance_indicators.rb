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
      integer :number_of_meetings
      string :satisfaction_status
    end
  end

  def completed_survivor_assessment
    form_responses(:survivor_assessment_form).any?(&:complete?)
  end

  def requires_safety_plan?
    form_responses(:safety_plan)
      .field(:safety_plan_needed)
      .any? { |result| result == 'yes' }
  end
  alias safety_plan_required requires_safety_plan?

  def completed_safety_plan
    safety_plans = form_responses(:safety_plan)
                   .select { |response| response.field(:safety_plan_needed) == 'yes' }

    !safety_plans.empty? && safety_plans.all?(&:complete?)
  end

  def completed_action_plan
    form_responses(:action_plan_form)
      .subform(:action_plan_section)
      .any?(&:complete?)
  end

  def services_provided
    form_responses(:action_plan_form)
      .subform(:gbv_follow_up_subform_section)
      .field(:service_type_provided)
      .uniq
  end

  def action_plan_referral_statuses
    form_responses(:action_plan_form)
      .subform(:action_plan_subform_section)
      .field(:service_referral)
      .compact
  end

  def number_of_meetings
    form_responses(:action_plan_form)
      .subform(:gbv_follow_up_subform_section)
      .field(:followup_date)
      .compact.count
  end

  def safety_goals_progress
    goal_progress(:gbv_assessment_progress_safety)
  end

  def health_goals_progress
    goal_progress(:gbv_assessment_progress_health)
  end

  def psychosocial_goals_progress
    goal_progress(:gbv_assessment_progress_psychosocial)
  end

  def justice_goals_progress
    goal_progress(:gbv_assessment_progress_justice)
  end

  def other_goals_progress
    goal_progress(:gbv_assessment_other_goals)
  end

  def satisfaction_status
    return nil unless client_feedback

    feedback_responses = KPI::ClientFeedbackResponseList.new(responses: client_feedback)

    if feedback_responses.satisfied >= feedback_responses.unsatisfied
      'satisfied'
    else
      'unsatisfied'
    end
  end

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
end
