# frozen_string_literal: true

# This is a placeholder class for future use of Primero as a multi-program application.
# Currently multiple programs are modeled either through roles or by spinning
# up a new instance of Primero.
class PrimeroProgram < ApplicationRecord
  include LocalizableJsonProperty
  include Configuration

  localize_properties :name, :description

  validates :unique_id, uniqueness: { message: 'errors.models.primero_program.unique_unique_id' }
  validate :validate_name_in_english

  has_many :primero_modules

  before_create :set_unique_id

  private

  def set_unique_id
    return if unique_id.present?

    self.unique_id = "#{self.class.name}-#{name_en}".parameterize.dasherize
  end

  def validate_name_in_english
    return true if name_en.present?

    errors.add(:name, 'errors.models.primero_program.name_present')
    false
  end

end
