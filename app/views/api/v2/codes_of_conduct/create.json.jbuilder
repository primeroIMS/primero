# frozen_string_literal: true

json.data do
  json.partial! 'api/v2/codes_of_conduct/code_of_conduct', code_of_conduct: @code_of_conduct
end