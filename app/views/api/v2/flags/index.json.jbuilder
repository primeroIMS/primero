json.data do
  json.array! @record.flags.where.not('removed').order(:id) do |flag|
    json.partial! 'api/v2/flags/flag', flag: flag
  end
end
