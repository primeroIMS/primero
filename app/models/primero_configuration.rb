# frozen_string_literal: true

# This model persists the user-modifiable state of the Primero configuration as JSON.
# If desired, this configuration state can replace the current Primero configuration state.
class PrimeroConfiguration < ApplicationRecord
  CONFIGURABLE_MODELS = %w[FormSection Lookup Agency Role UserGroup Report ContactInformation].freeze

  PRIMERO_CONFIGURATION_FIELDS_SCHEMA = {
    'id' => { 'type' => 'string', 'format' => 'regex', 'pattern' => PermittedFieldService::UUID_REGEX },
    'name' => { 'type' => 'string' }, 'description' => { 'type' => %w[string null] },
    'version' => { 'type' => 'string' }, 'apply_now' => { 'type' => 'boolean' },
    'promote' => { 'type' => 'boolean' }, 'data' => { 'type' => 'object' }
  }.freeze

  attr_accessor :apply_now
  validate :validate_configuration_data
  validates :version, uniqueness: { message: 'errors.models.configuration.version.uniqueness' }

  before_create :generate_version, :populate_primero_version

  class << self
    def order_insensitive_attribute_names
      %w[name description]
    end

    def list(options = {})
      OrderByPropertyService.apply_order(all, options)
    end

    def new_with_user(created_by = nil)
      new.tap do |config|
        config.created_on = DateTime.now
        config.created_by = created_by&.user_name
      end
    end

    def current(created_by = nil)
      new.tap do |config|
        config.created_on = DateTime.now
        config.created_by = created_by&.user_name
        config.data = current_configuration_data
      end
    end

    def current_configuration_data
      CONFIGURABLE_MODELS.each_with_object({}) do |model, data|
        model_class = Kernel.const_get(model)
        data[model] = model_class.all.map(&:configuration_hash)
      end
    end

    def api_path
      '/api/v2/configurations'
    end
  end

  def apply_later!(applied_by = nil)
    ApplyConfigurationJob.perform_later(id, applied_by.id)
  end

  def promote_later!
    PrimeroConfigurationSyncJob.perform_later(id)
  end

  def apply_with_api_lock!(applied_by = nil)
    SystemSettings.lock_for_configuration_update
    PrimeroConfiguration.transaction { apply!(applied_by) }
  rescue StandardError => e
    Rails.logger.error("Could not apply configuration #{name}:#{version}. Rolling back.")
    Rails.logger.error([e.message, *e.backtrace].join($RS))
  ensure
    SystemSettings.unlock_after_configuration_update
  end

  def apply!(applied_by = nil)
    return unless can_apply?

    configure!
    clear_remainder!
    self.applied_on = DateTime.now
    self.applied_by = applied_by&.user_name
    save!
  end

  def can_apply?
    return true if primero_version.blank?

    Gem::Version.new(Primero::Application::VERSION) >= Gem::Version.new(primero_version)
  end

  private

  def configure!
    CONFIGURABLE_MODELS.each do |model|
      next unless data.key?(model)

      model_class = Kernel.const_get(model)
      model_class.sort_configuration_hash(data[model]).each do |configuration|
        model_class.create_or_update!(configuration)
      end
    end
  end

  def clear_remainder!
    remainder(FormSection).destroy_all
    remainder(Lookup).destroy_all
    remainder(Report).destroy_all
  end

  def remainder(model_class)
    model_data = data[model_class.name]
    configuration_unique_ids = model_data.map { |d| d[model_class.unique_id_attribute.to_s] }
    model_class.where.not(model_class.unique_id_attribute => configuration_unique_ids)
  end

  def validate_configuration_data
    data_is_valid = CONFIGURABLE_MODELS.reduce(true) do |valid, model|
      valid && (%w[Report Location].include?(model) || data[model]&.size&.positive?)
    end
    return if data_is_valid

    errors.add(:data, 'errors.models.configuration.data')
  end

  def populate_primero_version
    self.primero_version = Primero::Application::VERSION
  end

  def generate_version
    return if version

    date = DateTime.now.strftime('%Y%m%d.%H%M%S')
    uid7 = SecureRandom.uuid.last(7)
    self.version = "#{date}.#{uid7}"
  end
end
