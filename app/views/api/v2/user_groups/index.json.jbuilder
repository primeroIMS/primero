# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

json.data do
  json.array! @user_groups do |user_group|
    json.partial! 'api/v2/user_groups/user_group', user_group:
  end
end

json.metadata do
  json.total @total
  json.per @per
  json.page @page
end
