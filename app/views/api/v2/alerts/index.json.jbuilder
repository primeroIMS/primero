# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

json.data do
  json.array! @alerts do |alert|
    json.partial! 'api/v2/alerts/alert', alert:
  end
end
