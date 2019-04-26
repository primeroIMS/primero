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
    unless self.unique_id.present?
      self.unique_id = "#{self.class.name}-#{self.name_en}".parameterize.dasherize
    end
  end

  def validate_name_in_english
    return true if self.name_en.present?
    errors.add(:name, 'errors.models.primero_program.name_present')
    false
  end

end
