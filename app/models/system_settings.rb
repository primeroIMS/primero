class SystemSettings < CouchRest::Model::Base
  use_database :system_settings

  include PrimeroModel
  include Memoizable


  property :default_locale, String
  property :case_code_format, [String], :default => []
  property :case_code_separator, String
  property :auto_populate_list, :type => [AutoPopulateInformation], :default => []
  property :primero_version

  #TODO: Think about what needs to take place to the current config. Update?
  before_save :set_version
  after_initialize :set_version

  design do
    view :all
  end

  #SyetsmSettings shoudl be a singleton. It can have a hard-coded name.
  def name
    I18n.t('system_settings.label')
  end

  def update_default_locale
    logger.info "Setting the Primero locale to #{self.default_locale}"
    I18n.default_locale = self.default_locale
    I18n.locale = I18n.default_locale
  end

  def set_version
    self.primero_version = Primero::Application::VERSION
  end

  def auto_populate_info(field_key = "")
    self.auto_populate_list.select{|ap| ap.populate_field == field_key}.first
  end

  def self.handle_changes
    system_settings = SystemSettings.first
    system_settings.update_default_locale if system_settings.present?
  end

  class << self
    def current
      SystemSettings.first
    end
    memoize_in_prod :current
  end

  extend Observable
  add_observer(self, :handle_changes)

end
