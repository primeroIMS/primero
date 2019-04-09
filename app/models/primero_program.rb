class PrimeroProgram < ActiveRecord::Base
  include LocalizableJsonProperty

  localize_properties :name, :description

  validates :unique_id, uniqueness: { message: I18n.t('errors.models.primero_program.unique_unique_id') }
  validates :name, presence: { message: I18n.t('errors.models.primero_program.name_present') }

  has_many :primero_modules

  before_create :set_unique_id

  private

  def set_unique_id
    unless self.unique_id.present?
      self.unique_id = "#{self.class.name}-#{self.name_en}".parameterize.dasherize
    end
  end

end
