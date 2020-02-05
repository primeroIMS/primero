# frozen_string_literal: true

json.data do
  json.partial! 'api/v2/agencies/agency', agency: @agency
end
