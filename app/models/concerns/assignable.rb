# frozen_string_literal: true

# Defines how assigned users are calculated for a record
# NOTE: Assigned users for Transitionable records are handled by the Transition itself.
# If included in a Transitionable record this concern will need to handle assigned users for transitions
# to avoid unexpected behavior.
module Assignable
  extend ActiveSupport::Concern

  included do
    before_save :recalculate_assigned_user_names
  end

  def recalculate_assigned_user_names
    raise NotImplementedError
  end
end
