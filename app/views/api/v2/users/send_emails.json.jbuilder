# frozen_string_literal: true

json.data do
  json.subject params[:data][:subject]
  json.message params[:data][:message]
end
