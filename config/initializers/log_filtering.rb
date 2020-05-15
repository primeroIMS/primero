# frozen_string_literal: true

# Log filter to remove all sensitive fields from the debug SQL logsf.check_box
# Revisit this code when upgrading to Rails 6. There may be a an official way for doing this.
module SqlLogFilter
  def render_bind(column, value)
    return [column.name, '[FILTERED]'] if Rails.configuration.filter_parameters.include?(column.name)

    super
  end
end

ActiveRecord::LogSubscriber.prepend SqlLogFilter
