# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

json.data do
  json.array! @traces do |trace|
    json.partial! 'api/v2/traces/trace', trace:
  end
end
