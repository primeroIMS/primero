# frozen_string_literal: true

json.data do
  json.message params[:data][:message]
  json.filters params[:data][:filters]
end
