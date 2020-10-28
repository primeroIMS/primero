class GbvKpiCalculationService
  def initialize(child)
    @child = child
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
    return nil unless @child.client_feedback

    feedback_responses = KPI::ClientFeedbackResponseList.new(responses: @child.client_feedback)

    if feedback_responses.satisfied >= feedback_responses.unsatisfied
      'satisfied'
    else
      'unsatisfied'
    end
  end

  def form_responses(form_section_unique_id)
    form_section = FormSection.find_by(unique_id: form_section_unique_id)
    form_section_results = @child.send(form_section_unique_id)

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
