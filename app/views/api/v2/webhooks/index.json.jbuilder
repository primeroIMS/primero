# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

json.data do
  json.array! @webhooks do |webhook|
    json.partial! 'api/v2/webhooks/webhook', webhook:
  end
end
