json.data do
  json.partial! 'api/v2/flags/flag', flags: @record.flags
end
