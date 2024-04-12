# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

json.data do
  json.array! @transitions do |transition|
    json.partial! 'api/v2/transitions/transition', transition:
  end
end
