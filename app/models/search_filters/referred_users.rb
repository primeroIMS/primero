# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# Transform API query parameter referred_users=value into a sql query
class SearchFilters::ReferredUsers < SearchFilters::TransitionUsers
  def field_name
    'referred_users'
  end

  def transition_type
    Referral.name
  end
end
