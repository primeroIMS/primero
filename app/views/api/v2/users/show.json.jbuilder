# frozen_string_literal: true

json.data do
  json.partial! 'api/v2/users/user', user: @user
end
