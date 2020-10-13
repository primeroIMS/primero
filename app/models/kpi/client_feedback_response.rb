module KPI
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

  class ClientFeedbackResponse < ValueObject
    attr_accessor :response

    def assessed_field_values
      # These could be in the database and then we might use something like
      # the FormSectionResponse
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
end
