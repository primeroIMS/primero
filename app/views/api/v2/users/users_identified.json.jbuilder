# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

json.data do
  json.array! @users do |user|
    json.user_name user.user_name
    json.full_name user.full_name
    json.email user.email
  end
end

json.metadata do
  json.total @total
  json.per @per
  json.page @page
end
