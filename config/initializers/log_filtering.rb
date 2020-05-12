module SqlLogFilter
  def render_bind(column, value)
    return [column.name, '[FILTERED]'] if Rails.configuration.filter_parameters.include?(column.name)
    super
  end
end

ActiveRecord::LogSubscriber.prepend SqlLogFilter