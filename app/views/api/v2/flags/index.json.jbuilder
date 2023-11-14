# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

json.data do
  json.array! @record.flags.order(:id) do |flag|
    json.partial! 'api/v2/flags/flag', flag:
  end
end
