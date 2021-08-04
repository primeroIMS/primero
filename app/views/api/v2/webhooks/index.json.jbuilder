# frozen_string_literal: true

json.data do
  json.array! @webhooks do |webhook|
    json.partial! 'api/v2/webhooks/webhook', webhook: webhook
  end
end


