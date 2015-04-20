class SystemSettings < CouchRest::Model::Base
  use_database :system_settings

  include PrimeroModel


  property :default_locale, String

  design do
    view :all
  end

  def update_default_locale
    logger.info "Setting the Primero locale to #{self.default_locale}"
    I18n.default_locale = self.default_locale
    I18n.locale = I18n.default_locale
  end

  def self.handle_changes
    system_settings = SystemSettings.first
    system_settings.update_default_locale if system_settings.present?
  end

  extend Observable
  add_observer(self, :handle_changes)



end