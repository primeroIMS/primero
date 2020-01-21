json.data do
  json.array! @agencies do |agency|
    json.partial! 'api/v2/agencies/agency', agency: agency
  end
end

json.metadata do
  json.total @total
  json.per @per
  json.page @page
end
