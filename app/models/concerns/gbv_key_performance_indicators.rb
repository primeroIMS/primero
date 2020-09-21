module GBVKeyPerformanceIndicators
  extend ActiveSupport::Concern

  included do
    store_accessor :data, :survivor_assessment_form, :safety_plan,
                   :action_plan, :client_feedback

    searchable do
      boolean :completed_survivor_assessment
      boolean :safety_plan_required
      boolean :completed_safety_plan
      boolean :completed_action_plan
      boolean :case_plan_approved
      string :services_provided, multiple: true
      string :action_plan_referral_statuses, multiple: true
      string :referred_services, multiple: true
      integer :number_of_meetings
      float :safety_goals_progress
      float :health_goals_progress
      float :psychosocial_goals_progress
      float :justice_goals_progress
      float :other_goals_progress
      boolean :duplicate
      string :satisfaction_status
    end
  end

  #  #find_in_form(path : [String], form : Object | {}) : []
  #
  # This method will find all of the non nil values in a array of objects
  # which may have attributes which themselves are arrays of objects. All of the
  # non nil values are returned as a flat array.
  def find_in_form(path, form = self)
    return [] if path.empty?

    name_or_id, *rest = *path

    field_or_forms = form[name_or_id] || begin
      form.public_send(name_or_id.to_sym) if form.respond_to?(name_or_id.to_sym)
    end

    return [] unless field_or_forms
    return field_or_forms if rest.empty?

    Array(field_or_forms).flat_map { |result| find_in_form(rest, result) }
  end

  def fields_in_form(form, fields)
    fields.map { |field| form[field] }
  end

  # #form_is_completed(form : {}, mandatory_fields : [String]) : Boolean
  #
  # Checks to see if all of the mandatory fields are present in the form.
  def form_is_complete(form, mandatory_fields)
    mandatory_fields.all? { |field| form[field].present? }
  end

  # Should be an attribute on Field
  def self.survivor_assessment_mandatory_fields
    [
      'assessment_emotional_state_start',
      'assessment_emotional_state_end',
      'assessment_presenting_problem',
      'assessment_main_concerns',
      'assessment_current_situation'
    ]
  end

  def completed_survivor_assessment
    find_in_form(['survivor_assessment_form'])
      .all? do |form|
        form_is_complete(form, self.class.survivor_assessment_mandatory_fields)
      end
  end

  def self.safety_plan_mandatory_fields
    [
      'safety_plan_needed',
      'safety_plan_developed_with_survivor',
      'safety_plan_completion_date',
      'safety_plan_main_concern',
      'safety_plan_preparedness_signal',
      'safety_plan_preparedness_gathered_things'
    ]
  end

  def requires_safety_plan?
    find_in_form(['safety_plan']).
      # This is a lot of concrete domain knowledge to need about a
      # dynamic form. Should this by dynamic? Should the form be hard coded?
      any? { |plan| plan['safety_plan_needed'] == 'yes' }
  end
  alias :safety_plan_required :requires_safety_plan?

  def completed_safety_plan
    find_in_form(['safety_plan'])
      .any? do |plan|
        form_is_complete(plan, self.class.safety_plan_mandatory_fields)
      end
  end

  def self.action_plan_mandatory_fields
    [
      'service_type',
      'service_referral',
      'service_referral_written_consent'
    ]
  end

  def completed_action_plan
    find_in_form(['action_plan'])
      .any? do |plan|
        form_is_complete(plan, self.class.action_plan_mandatory_fields)
      end
  end

  def services_provided
    find_in_form(
      ['action_plan', 'gbv_follow_up_subform_section', 'service_type_provided']
    ).uniq
  end

  def action_plan_referral_statuses
    find_in_form(['action_plan', 'action_plan_subform_section', 'service_referral'])
  end

  def referred_services
    find_in_form(['action_plan', 'gbv_follow_up_subform_section', 'service_type_provided'])
  end

  def number_of_meetings
    find_in_form(['action_plan', 'gbv_follow_up_subform_section', 'followup_date'])
      .count
  end

  def percentage_goals_met(goals)
    return nil if goals.empty?

    applicable_goals = goals.count { |status| status != 'n_a' }
    return nil if applicable_goals == 0

    met_goals = goals.count { |status| status == 'met' }
    return 0 if met_goals == 0

    met_goals / applicable_goals.to_f
  end

  def safety_goals_progress
    percentage_goals_met(find_in_form([
                                        'action_plan',
                                        'gbv_follow_up_subform_section',
                                        'gbv_assessment_progress_safety'
                                      ]))
  end

  def health_goals_progress
    percentage_goals_met(find_in_form([
                                        'action_plan',
                                        'gbv_follow_up_subform_section',
                                        'gbv_assessment_progress_health'
                                      ]))
  end

  def psychosocial_goals_progress
    percentage_goals_met(find_in_form([
                                        'action_plan',
                                        'gbv_follow_up_subform_section',
                                        'gbv_assessment_progress_psychosocial'
                                      ]))
  end

  def justice_goals_progress
    percentage_goals_met(find_in_form([
                                        'action_plan',
                                        'gbv_follow_up_subform_section',
                                        'gbv_assessment_progress_justice'
                                      ]))
  end

  def other_goals_progress
    percentage_goals_met(find_in_form([
                                        'action_plan',
                                        'gbv_follow_up_subform_section',
                                        #  This naming is not the same as the other goals which is jarring.
                                        'gbv_assessment_other_goals'
                                      ]))
  end

  def self.client_satisfaction_fields
    [
      "opening_hours_when_client_could_attend",
      "client_comfortable_with_case_worker",
      "same_case_worker_each_visit",
      "could_client_choose_support_person",
      "client_informed_of_options",
      "client_decided_what_next",
      "client_referred_elsewhere",
      "survivor_discreet_access",
      "staff_respect_confidentiality",
      "client_private_meeting",
      "staff_friendly",
      "staff_open_minded",
      "staff_answered_all_questions",
      "staff_client_could_understand",
      "staff_allowed_enough_time",
      "staff_helpful",
      "client_feel_better",
      "would_client_recommend_friend"
    ]
  end

  def satisfaction_status
    feedback_forms = find_in_form(['client_feedback'])

    return nil unless !feedback_forms.empty?

    # calculate satisifaction per form as otherwise we'd be weighting
    # forms with more ansers more heavily that those with fewer answers.
    is_satisfied = feedback_forms
                   .map do |f|
      default = { 'yes' => 0, 'no' => 0, 'n_a' => 0 }

      tally = fields_in_form(f, self.class.client_satisfaction_fields)
              .compact
              .group_by(&:itself)
              .transform_values(&:count)

      next nil if tally.empty?

      answers = default.merge(tally)

      next nil unless answers['yes'] > 0 || answers['no'] > 0

      answers['yes'] >= answers['no']
    end.compact

    return nil if is_satisfied.empty?

    satisfied = is_satisfied.select(&:itself).count
    unsatisfied = is_satisfied.reject(&:itself).count

    if satisfied >= unsatisfied
      'satisfied'
    else
      'unsatisfied'
    end
  end
end
