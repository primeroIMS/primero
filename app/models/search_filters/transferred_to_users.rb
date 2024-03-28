# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# Transform API query parameter transferred_to_users=value into a sql query
class SearchFilters::TransferredToUsers < SearchFilters::TransitionUsers
  def field_name
    'transferred_to_users'
  end

  def transition_type
    Transfer.name
  end
end
