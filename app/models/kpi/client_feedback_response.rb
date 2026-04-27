# frozen_string_literal: true

# ClientFeedbackResponse
#
# Represents a filled out client feedback form. Has notional understanding
# of whether it is "valid" and where the user who filled the form out was
# satisfied or not.
class Kpi::ClientFeedbackResponse < ValueObject
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

  attr_accessor :response

  def assessed_field_values
    # These could be in the database and then we might use something like
    # the FormSectionResponse
    CLIENT_SATISFACTION_FIELDS.map { |field| response[field] }
  end

  def default_tally
    Hash.new { |h, k| h[k] = 0 }
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

  def valid_response?
    !assessed_field_values.compact.empty?
  end

  def satisfied?
    tally[true] >= tally[false] &&
      tally['scale_two'] + tally['scale_three'] >= tally['scale_one']
  end
end
