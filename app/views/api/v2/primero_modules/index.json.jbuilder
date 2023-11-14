# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

json.data do
  json.array! @primero_modules do |primero_module|
    json.partial! 'api/v2/primero_modules/primero_module', primero_module:
  end
end
