# frozen_string_literal: true

json.data do
  json.partial! 'api/v2/webpush_subscriptions/webpush_subscription', webpush_subscription: @webpush_subscription
end
