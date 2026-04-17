# frozen_string_literal: true

json.data do
  json.array! @users do |user|
    json.id user.id
    json.user_name user.user_name
  end
end
