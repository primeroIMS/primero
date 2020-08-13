# frozen_string_literal: true

# This model persists the user-modifiable state of the Primero configuration as JSON.
# If desired, this configuration state can replace the current Primero configuration state.
class Configuration < ApplicationRecord
  CONFIGURABLE_MODELS = %w[FormSection Lookup Location Agency Role UserGroup Report ContactInformation].freeze

  validate :validate_configuration_data
  validates :version, presence: { message: 'errors.models.configuration.version.presence' },
                      uniqueness: { message: 'errors.models.configuration.version.uniqueness' }

  def self.current(created_by = nil)
    new.tap do |config|
      config.created_at = DateTime.now
      config.created_by = created_by
      config.data = current_configuration_data
    end
  end

  def self.current_configuration_data
    CONFIGURABLE_MODELS.each_with_object({}) do |model, data|
      model_class = Kernel.const_get(model)
      data[model] = model_class.all.map(&:configuration_hash)
    end
  end

  def apply!(applied_by = nil)
    data.each do |model, model_data|
      model_class = Kernel.const_get(model)
      model_data.each { |configuration| model_class.create_or_update(configuration) }
      # TODO: Disable the models that aren't included in the data
    end
    self.applied_at = DateTime.now
    self.applied_by = applied_by
    save!
  end

  def validate_configuration_data
    data_is_valid = CONFIGURABLE_MODELS.reduce(true) do |valid, model|
      valid && (%w[Report Location].include?(model) || data[model].size.positive?)
    end
    return if data_is_valid

    errors.add(:data, 'errors.models.configuration.data')
  end
end
