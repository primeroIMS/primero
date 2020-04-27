module ReportingLocationActions
  extend ActiveSupport::Concern

  def load_default_settings
    reporting_location_config = current_user.reporting_location_config
    if reporting_location_config.present?
      @admin_level = reporting_location_config.admin_level || ReportingLocation::DEFAULT_ADMIN_LEVEL
      @reporting_location = reporting_location_config.field_key || ReportingLocation::DEFAULT_FIELD_KEY
      @reporting_location_label = reporting_location_config.label_key || ReportingLocation::DEFAULT_LABEL_KEY
      @reporting_location_hierarchy_filter = reporting_location_config.hierarchy_filter || nil
      Rails.logger.info "**************************************************"
      Rails.logger.info "**DEBUGGING** User Name #{current_user.user_name}"
      Rails.logger.info "**DEBUGGING** Admin Level #{reporting_location_config.admin_level}"
      Rails.logger.info "**************************************************"
    else
      @admin_level ||= ReportingLocation::DEFAULT_ADMIN_LEVEL
      @reporting_location ||= ReportingLocation::DEFAULT_FIELD_KEY
      @reporting_location_label ||= ReportingLocation::DEFAULT_LABEL_KEY
      @reporting_location_hierarchy_filter ||= nil
    end
  end
end