# frozen_string_literal: true

json.data do
  json.partial! 'api/v2/users/user', user: @user
end
json.metadata do
  json.total_enabled User.standard.count
  json.maximum_users SystemSettings.current.maximum_users
end
