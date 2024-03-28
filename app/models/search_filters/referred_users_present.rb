# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# Transform API query parameter referred_users_present=value into a sql query
class SearchFilters::ReferredUsersPresent < SearchFilters::TransitionUsersPresent
  def field_name
    'referred_users_present'
  end

  def transition_type
    Referral.name
  end
end
