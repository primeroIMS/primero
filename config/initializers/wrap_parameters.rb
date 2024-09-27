# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

ActiveSupport.parse_json_times = true

# This file contains settings for ActionController::ParamsWrapper which
# is enabled by default.

# Disable parameter wrapping. You can disable this by setting :format to an empty array.
# To enable for json, set format: [:json]
ActiveSupport.on_load(:action_controller) do
  wrap_parameters format: []
end

# To enable root element in JSON for ActiveRecord objects.
# ActiveSupport.on_load(:active_record) do
#   self.include_root_in_json = true
# end
