# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

json.data do
  json.array! @users do |user|
    json.partial! 'api/v2/users/user', user:
  end
end

json.metadata do
  json.total @total
  json.per @per
  json.page @page
  json.total_enabled User.enabled.count
end
