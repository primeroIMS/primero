# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

json.data do
  json.partial! 'api/v2/users/user', user: @user
end
json.metadata do
  json.total_enabled User.enabled.count
  json.maximum_users SystemSettings.current.maximum_users
end
