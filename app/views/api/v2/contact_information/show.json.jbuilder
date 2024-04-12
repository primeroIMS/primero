# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

json.data do
  json.merge! @contact_information.attributes.except('id')
  json.system_version @system_settings.primero_version
end.compact!
