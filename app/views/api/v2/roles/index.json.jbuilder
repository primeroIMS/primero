# frozen_string_literal: true

json.data do
  json.array! @roles do |role|
    json.partial! 'api/v2/roles/role', role: role
  end
end

json.metadata do
  json.total @total
  json.per @per
  json.page @page
end
