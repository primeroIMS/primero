# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

json.errors do
  json.array! @errors do |error|
    json.partial! 'api/v2/errors/error', error:
  end
end
