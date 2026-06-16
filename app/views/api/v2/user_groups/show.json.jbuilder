# frozen_string_literal: true

json.data do
  json.partial! 'api/v2/user_groups/user_group', user_group: @user_group
end
