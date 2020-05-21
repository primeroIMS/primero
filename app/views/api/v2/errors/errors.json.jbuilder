# frozen_string_literal: true

json.errors do
  json.array! @errors do |error|
    json.partial! 'api/v2/errors/error', error: error
  end
end
