begin
  if ActiveRecord::Base.connection.table_exists? :system_settings
    system_settings = SystemSettings.current
    if system_settings.present?
      use_identity_provider = system_settings.use_identity_provider.present?

      Rails.application.configure do
        config.x.idp.use_identity_provider = use_identity_provider
      end
    end
  end
rescue ActiveRecord::NoDatabaseError => e
  Rails.logger.warn e.message
end