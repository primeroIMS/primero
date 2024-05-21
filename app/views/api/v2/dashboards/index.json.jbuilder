# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

json.data do
  json.array! @dashboards do |dashboard|
    json.partial! 'api/v2/dashboards/dashboard', dashboard:
  end
end
