# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# Log filter to remove all sensitive fields from the debug SQL logsf.check_box
module SqlLogFilter
  def render_bind(column, value)
    return [column.name, '[FILTERED]'] if Rails.configuration.filter_parameters.include?(column.name)

    super
  end
end

ActiveRecord::LogSubscriber.prepend SqlLogFilter
