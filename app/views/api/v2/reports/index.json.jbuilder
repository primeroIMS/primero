json.data do
  json.array! @reports do |report|
    json.partial! 'api/v2/reports/report', report: report
  end
end

json.metadata do
  json.total @total
  json.per @per
  json.page @page
end
