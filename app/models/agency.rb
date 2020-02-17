# frozen_string_literal: true

# Organizations that users who manage the the data in Primero belong to.
class Agency < ApplicationRecord
  include LocalizableJsonProperty
  include Configuration

  LOGO_DIMENSION = {
    logo_full: { width: 512, height: 512 },
    logo_icon: { width: 100, height: 100 }
  }.freeze

  localize_properties :name, :description

  validates :unique_id, presence: true, uniqueness: { message: 'errors.models.agency.unique_id' }
  validates :agency_code, presence: { message: 'errors.models.agency.code_present' }
  validate :validate_name_in_english

  has_one_attached :logo_full
  has_one_attached :logo_icon
  has_many :users, inverse_of: :agency

  scope :enabled, ->(is_enabled = true) { where.not(disabled: is_enabled) }

  validates :logo_full, file_size: { less_than_or_equal_to: 1.megabytes },
                        file_content_type: { allow: 'image/png' }, if: -> { logo_full.attached? }
  validates :logo_icon, file_size: { less_than_or_equal_to: 1.megabytes },
                        file_content_type: { allow: 'image/png' }, if: -> { logo_icon.attached? }

  validate :validate_logo_full_dimension, if: -> { logo_full.attached? }
  validate :validate_logo_icon_dimension, if: -> { logo_icon.attached? }

  after_initialize :generate_unique_id, unless: :persisted?

  class << self
    # TODO: This method may be unused.
    def display_text(agency_id, opts = {})
      locale = (opts[:locale].present? ? opts[:locale] : I18n.locale)
      agency = Agency.find_by_id(agency_id)
      (agency.present? ? agency.name(locale) : '')
    end

    def new_with_properties(agency_params)
      agency = Agency.new(agency_params.except(:name, :description))
      agency.name_i18n = agency_params[:name]
      agency.description_i18n = agency_params[:description]
      agency
    end
  end

  def update_properties(agency_params)
    converted_params = FieldI18nService.convert_i18n_properties(Agency, agency_params)
    merged_props = FieldI18nService.merge_i18n_properties(attributes, converted_params)
    assign_attributes(agency_params.except(:name, :description).merge(merged_props))
  end

  private

  def validate_name_in_english
    return true if name_en.present?

    errors.add(:name, 'errors.models.agency.name_present')
  end

  def validate_logo_full_dimension
    return unless image?(logo_full)

    validate_image_dimensions(
      logo_full,
      LOGO_DIMENSION[:logo_full][:width], LOGO_DIMENSION[:logo_full][:height]
    )
  end

  def validate_logo_icon_dimension
    return unless image?(logo_icon)

    validate_image_dimensions(
      logo_icon,
      LOGO_DIMENSION[:logo_icon][:width], LOGO_DIMENSION[:logo_icon][:height]
    )
  end

  def validate_image_dimensions(image, valid_width, valid_height)
    # return unless image.attachment.content_type.start_with?('image/*')

    metadata = ActiveStorage::Analyzer::ImageAnalyzer.new(image).metadata
    width = metadata.dig(:width)
    height = metadata.dig(:height)
    return if width.blank? || height.blank?
    return unless width > valid_width || height > valid_height

    errors.add(image.name.to_sym, 'errors.models.agency.logo_dimension')
  end

  def image?(image)
    image.attachment.content_type.start_with?('image/*')
  end

  def generate_unique_id
    return unless agency_code.present? && unique_id.blank?

    self.unique_id = "agency-#{agency_code}".parameterize.dasherize
  end
end