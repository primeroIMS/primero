# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

json.data do
  json.array! @users do |user|
    json.id user.id
    json.user_name user.user_name
  end
end
