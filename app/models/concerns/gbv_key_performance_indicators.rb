# frozen_string_literal: true

# Module for capturing all of the GBV KPI related logic.
module GBVKeyPerformanceIndicators
  extend ActiveSupport::Concern

  included do
    store_accessor :data, :survivor_assessment_form, :safety_plan,
                   :action_plan, :client_feedback

    searchable do
      %i[completed_survivor_assessment safety_plan_required completed_safety_plan completed_action_plan case_plan_approved duplicate].each { |f| boolean(f) }
      %i[services_provided action_plan_referral_statuses referred_services].each { |f| string(f, multiple: true) } 
      %i[safety_goals_progress health_goals_progress psychosocial_goals_progress justice_goals_progress other_goals_progress].each { |f| float(f) }
      integer :number_of_meetings
      string :satisfaction_status
    end
  end

  FormSectionResponse = Struct.new(:response, :form_section) do
    def mandatory_fields
      @mandatory_fields ||= form_section.fields.select { |f| f.mandatory? }
    end

    def complete?
      mandatory_fields.all? { |f| response[f.name].present? }
    end
  end

  FormSectionResponseRepo = Struct.new(:responses) do
    include Enumerable

    def form_section_responses
      @form_section_responses ||= responses
        .map { |result| FormSectionResponse.new(result, form_section) }
    end
    alias each form_section_responses

    def field(name)
      map { |response| response[name] }
    end

  end

  # Return a list of responses for a given form_section unique_id
  def form_responses(form_section_id)
    form_section = FormSection.find_by(unique_id: form_section_id)
    form_section_results = self[form_section_id]

    if form_section_results.nil? or form_section_results.empty?
      FormSectionResponseRepo.new([])
    else
      FormSectionResponseRepo.new(form_section_results)
    end
  end


  # #find_in_form(path : [String], form : Object | {}) : []
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

  def completed_survivor_assessment
    form_responses(:survivor_assessment_form).all?(:complete?)
  end

  def requires_safety_plan?
    form_responses(:safety_plan)
      .field(:safety_plan_needed)
      .any? { |result| result == 'yes' }
  end
  alias safety_plan_required requires_safety_plan?

  def completed_safety_plan
    form_responses(:safety_plan).all?(:complete)
  end

  ACTION_PLAN_MANDATORY_FIELDS = %w[
    service_type
    service_referral
    service_referral_written_consent
  ].freeze

  def completed_action_plan
    find_in_form(['action_plan'])
      .any? do |plan|
        form_is_complete(plan, ACTION_PLAN_MANDATORY_FIELDS)
      end
  end

  def services_provided
    find_in_form(
      %w[action_plan gbv_follow_up_subform_section service_type_provided]
    ).uniq
  end

  def action_plan_referral_statuses
    find_in_form(%w[action_plan action_plan_subform_section service_referral])
  end

  def referred_services
    find_in_form(%w[action_plan gbv_follow_up_subform_section service_type_provided])
  end

  def number_of_meetings
    find_in_form(%w[action_plan gbv_follow_up_subform_section followup_date])
      .count
  end

  def percentage_goals_met(goals)
    return nil if goals.empty?

    applicable_goals = goals.count { |status| status != 'n_a' }
    return nil if applicable_goals.zero?

    met_goals = goals.count { |status| status == 'met' }
    return 0 if met_goals.zero?

    met_goals / applicable_goals.to_f
  end

  def safety_goals_progress
    percentage_goals_met(find_in_form(%w[
                                        action_plan
                                        gbv_follow_up_subform_section
                                        gbv_assessment_progress_safety
                                      ]))
  end

  def health_goals_progress
    percentage_goals_met(find_in_form(%w[
                                        action_plan
                                        gbv_follow_up_subform_section
                                        gbv_assessment_progress_health
                                      ]))
  end

  def psychosocial_goals_progress
    percentage_goals_met(find_in_form(%w[
                                        action_plan
                                        gbv_follow_up_subform_section
                                        gbv_assessment_progress_psychosocial
                                      ]))
  end

  def justice_goals_progress
    percentage_goals_met(find_in_form(%w[
                                        action_plan
                                        gbv_follow_up_subform_section
                                        gbv_assessment_progress_justice
                                      ]))
  end

  def other_goals_progress
    percentage_goals_met(find_in_form([
                                        'action_plan',
                                        'gbv_follow_up_subform_section',
                                        # This naming is not the same as the other goals which is jarring.
                                        'gbv_assessment_other_goals'
                                      ]))
  end

  CLIENT_SATISFACTION_FIELDS = %w[
    opening_hours_when_client_could_attend
    client_comfortable_with_case_worker
    same_case_worker_each_visit
    could_client_choose_support_person
    client_informed_of_options
    client_decided_what_next
    client_referred_elsewhere
    survivor_discreet_access
    staff_respect_confidentiality
    client_private_meeting
    staff_friendly
    staff_open_minded
    staff_answered_all_questions
    staff_client_could_understand
    staff_allowed_enough_time
    staff_helpful
    client_feel_better
    would_client_recommend_friend
  ].freeze

  ClientFeedbackResponse = Struct.new(:response) do
    def assessed_field_values
      CLIENT_SATISFACTION_FIELDS.map { |field| response[field] }
    end

    def default_tally
      { 'yes' => 0, 'no' => 0, 'n_a' => 0 }
    end

    def tally
      @tally ||= default_tally
                 .merge(
                   assessed_field_values
                     .compact
                     .group_by(&:itself)
                     .transform_values(&:count)
                 )
    end

    def satisfied?
      tally['yes'] >= tally['no']
    end
  end

  ClientFeedbackResponses = Struct.new(:responses) do
    def responses
      @responses ||= self[:responses]
                     .map { |response| ClientFeedbackResponse.new(response) }
    end

    def satisfied
      responses.count(&:satisfied?)
    end

    def unsatisfied
      responses.count { |response| !response.satisfied? }
    end
  end

  def satisfaction_status
    return nil unless client_feedback

    feedback_responses = ClientFeedbackResponses.new(client_feedback)

    if feedback_responses.satisfied >= feedback_responses.unsatisfied
      'satisfied'
    else
      'unsatisfied'
    end
  end
end
