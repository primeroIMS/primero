# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

json.data do
  json.partial! 'api/v2/flags/flag', flag: @flag, updates_for_record: @updated_field_names
end
