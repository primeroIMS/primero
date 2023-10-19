# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

json.data do
  json.array! @webpush_subscriptions do |webpush_subscription|
    json.partial! 'api/v2/webpush_subscriptions/webpush_subscription', webpush_subscription:
  end
end
