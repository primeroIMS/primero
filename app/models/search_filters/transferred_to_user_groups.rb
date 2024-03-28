# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# Transform API query parameter transferred_to_users=value into a sql query
class SearchFilters::TransferredToUserGroups < SearchFilters::TransitionToUserGroups
  def field_name
    'transferred_to_user_groups'
  end

  def transition_type
    Transfer.name
  end
end
