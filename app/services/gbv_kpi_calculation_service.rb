# frozen_string_literal: true

# GBVKpiCalculationService
#
# Provides methods for calulating the cached information required for the
# Kpis
#
# rubocop:disable Metrics/ClassLength
class GBVKpiCalculationService
  def self.from_record(record)
    GBVKpiCalculationService.new(record) unless record.module_id != PrimeroModule::GBV
  end

  def initialize(record)
    @record = record
  end

  def case_lifetime_days
    closure_form = form_responses(:gbv_case_closure_form).first

    return nil unless closure_form

    date_created = closure_form.field(:created_at) || @record.created_at
    date_closed = closure_form.field(:date_closure)
    return nil if date_created.nil? || date_closed.nil?

    (date_closed.to_date - date_created.to_date).to_i
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
    form_responses(:safety_plan).any?(&:complete?)
  end

  def completed_action_plan
    form_responses(:action_plan_form)
      .subform(:action_plan_section)
      .any?(&:complete?)
  end

  def completed_and_approved_action_plan
    response = form_responses(:action_plan_form).first
    response&.field(:action_plan_approved) &&
      response.subform(:action_plan_section).any?(&:complete?)
  end

  def services_provided
    form_responses(:action_plan_form)
      .subform(:action_plan_section)
      .select do |f|
        # hard coded values like this indicate information that could
        # be stored in the config. The only issue is that this creates
        # a big separation between code that is very dependant on each
        # other. I think that field config as it stand
        # (e.g. mandatory_for_completion) should probably live in some
        # KPI related modules.
        f.field(:service_referral) == 'service_provided_by_your_agency'
      end.field(:service_type)
      .uniq
  end

  def action_plan_referral_statuses
    form_responses(:action_plan_form)
      .subform(:action_plan_section)
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
    feedback_responses = Kpi::ClientFeedbackResponseList.new(
      responses: access_migrated_forms(:client_feedback)
    )

    return nil unless feedback_responses.valid_responses?

    if feedback_responses.satisfied >= feedback_responses.unsatisfied
      'satisfied'
    else
      'unsatisfied'
    end
  end

  # This is for incidents only. Currently we're using concerns to capture
  # the information about which searches and kpi calculation fields are
  # required for each model. I'm not certain this is a good strategy but
  # I don't have a better one.
  def reporting_delay_days
    reported_at = @record.date_of_first_report
    occured_at = @record.incident_date_derived
    return 0 unless reported_at && occured_at

    (reported_at.to_date - occured_at.to_date).to_i
  end

  def form_responses(form_section_unique_id)
    form_section = form_section_cache[form_section_unique_id]

    form_section_results = access_migrated_forms(form_section_unique_id)

    return FormSectionResponseList.new(responses: [], form_section: nil) unless form_section

    FormSectionResponseList.new(responses: form_section_results, form_section: form_section)
  end

  # Cache data so that it can be shared across kpi calculations
  def form_section_cache
    # This only preloads subforms at depth 1 (which is most subforms).
    # Any subforms which are deeper will cause new queries for the subform
    # and for it's fields.
    @form_section_cache ||= Hash.new do |cache, form_section_unique_id|
      cache[form_section_unique_id] =
        FormSection.eager_load(fields: { subform: :fields })
                   .find_by(unique_id: form_section_unique_id)
    end
  end

  def access_migrated_forms(form_section_unique_id)
    @record.respond_to?(form_section_unique_id) && @record.send(form_section_unique_id) || [@record.data]
  end

  def percentage_goals_met(goals)
    return nil if goals.empty?

    applicable_goals = goals.count { |status| status != 'n_a' }
    return nil if applicable_goals.zero?

    met_goals = goals.count { |status| ['met', 'in_progress'].include?(status) }
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
# rubocop:enable Metrics/ClassLength
