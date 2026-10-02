# frozen_string_literal: true

# Restricts actions on records with a transition pending for the current user
module Api::V2::Concerns::PendingTransitionRestriction
  extend ActiveSupport::Concern

  def authorize_pending_transition!(record)
    raise Errors::ForbiddenOperation if record.pending_transition_for?(current_user)

    true
  end
end
