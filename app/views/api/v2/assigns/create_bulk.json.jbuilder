# frozen_string_literal: true

json.data do
  json.transitioned_to params[:data][:transitioned_to]
  json.filters params[:data][:filters]
end
