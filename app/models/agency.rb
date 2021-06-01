# frozen_string_literal: true

# Organizations that users who manage the the data in Primero belong to.
class Agency < ApplicationRecord
  include LocalizableJsonProperty
  include ConfigurationRecord

  LOGO_DIMENSION = {
    logo_full: { width: 512, height: 512 },
    logo_icon: { width: 100, height: 100 }
  }.freeze
  TERMS_OF_USE_MAX_SIZE = 10.megabytes.freeze
  TERMS_OF_USE_CONTENT_TYPE = 'application/pdf'

  localize_properties :name, :description
  attribute :logo_full_base64, :string
  attribute :logo_full_file_name, :string
  attribute :logo_icon_base64, :string
  attribute :logo_icon_file_name, :string
  attribute :terms_of_use_base64, :string
  attribute :terms_of_use_file_name, :string

  validates :agency_code, presence: { message: 'errors.models.agency.code_present' }
  validate :validate_name_in_english

  has_one_attached :logo_full, dependent: false
  has_one_attached :logo_icon, dependent: false
  has_one_attached :terms_of_use, dependent: false
  has_many :users, inverse_of: :agency

  scope :enabled, ->(is_enabled = true) { where.not(disabled: is_enabled) }
  scope :with_logos, -> { enabled.where(logo_enabled: true) }
  scope :with_pdf_logo_option, -> { enabled.where(pdf_logo_option: true) }

  validates :logo_full, file_size: { less_than_or_equal_to: 1.megabytes },
                        file_content_type: {
                          allow: 'image/png',
                          message: 'errors.models.agency.logo_format'
                        }, if: -> { logo_full.attached? }
  validates :logo_icon, file_size: { less_than_or_equal_to: 1.megabytes },
                        file_content_type: {
                          allow: 'image/png',
                          message: 'errors.models.agency.logo_format'
                        }, if: -> { logo_icon.attached? }
  validates :terms_of_use, file_size: { less_than_or_equal_to: TERMS_OF_USE_MAX_SIZE },
                           file_content_type: {
                             allow: TERMS_OF_USE_CONTENT_TYPE,
                             message: 'errors.models.agency.terms_of_use_format'
                           }, if: -> { terms_of_use.attached? }

  validate :validate_logo_full_dimension, if: -> { logo_full.attached? }
  validate :validate_logo_icon_dimension, if: -> { logo_icon.attached? }

  before_create :generate_unique_id
  before_save :set_logo_enabled

  class << self
    def new_with_properties(agency_params)
      agency = Agency.new(agency_params.except(:name, :description))
      agency.name_i18n = agency_params[:name]
      agency.description_i18n = agency_params[:description]
      agency.attach_files(agency_params)
      agency
    end

    def list(params = {})
      agencies = params[:managed] ? all : enabled
      agencies = agencies.where(disabled: params[:disabled].values) if params[:disabled].present?
      order_query = SqlOrderQueryService.build_order_query(self, params)
      order_query.present? ? agencies.order(order_query) : agencies
    end

    def get_field_using_unique_id(unique_id, field)
      where(unique_id: unique_id).pluck(field)&.first
    end
  end

  def update_properties(agency_params)
    agency_params = agency_params.with_indifferent_access if agency_params.is_a?(Hash)
    converted_params = FieldI18nService.convert_i18n_properties(Agency, agency_params)
    merged_props = FieldI18nService.merge_i18n_properties(attributes, converted_params)
    assign_attributes(
      agency_params.except(
        :name, :description, :logo_full_file_name, :logo_full_base64, :logo_icon_file_name, :logo_icon_base64,
        :terms_of_use_file_name, :terms_of_use_base64
      ).merge(merged_props)
    )
    attach_files(agency_params)
  end

  def attach_files(agency_params)
    attach_file(agency_params[:logo_full_file_name], agency_params[:logo_full_base64], logo_full)
    attach_file(agency_params[:logo_icon_file_name], agency_params[:logo_icon_base64], logo_icon)
    attach_file(agency_params[:terms_of_use_file_name], agency_params[:terms_of_use_base64], terms_of_use)
  end

  def logo_full_file_name
    self[:logo_full_file_name] || (logo_full.attached? && logo_full&.filename&.to_s)
  end

  def logo_icon_file_name
    self[:logo_icon_file_name] || (logo_icon.attached? && logo_icon&.filename&.to_s)
  end

  def configuration_hash
    attributes.except('id')
              .merge(configuration_hash_for_logo(logo_full))
              .merge(configuration_hash_for_logo(logo_icon))
              .merge(configuration_hash_for_logo(terms_of_use))
              .with_indifferent_access
  end

  def generate_unique_id
    self.unique_id ||= agency_code
  end

  private

  def attach_file(file_name, file_base64, file)
    return file.purge if !file_name.present? && file_base64&.length&.zero?
    return unless file_name.present? && file_base64.present?

    decoded_attachment = Base64.decode64(file_base64)
    io = StringIO.new(decoded_attachment)
    file.attach(io: io, filename: file_name)
  end

  def detach_logo(logo)
    logo.purge
  end

  def configuration_hash_for_logo(logo)
    return {} unless logo.attached?

    logo_data = logo_raw(logo)
    return {} unless logo_data.present?

    {}.tap do |hash|
      hash["#{logo.name}_base64"] = Base64.encode64(logo.download)
      hash["#{logo.name}_file_name"] = logo.blob.filename.to_s
    end
  end

  def logo_raw(logo)
    logo.download
  rescue SystemCallError
    nil
  end

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

  def validate_image_dimensions(logo, valid_width, valid_height)
    metadata = ActiveStorage::Analyzer::ImageAnalyzer.new(logo).metadata
    width = metadata.dig(:width)
    height = metadata.dig(:height)
    return if width.blank? || height.blank?
    return unless width > valid_width || height > valid_height

    errors.add(logo.name.to_sym, 'errors.models.agency.logo_dimension')
  end

  def image?(logo)
    logo.attachment.content_type.start_with?('image/*')
  end

  def set_logo_enabled
    return if logo_full.attached? && logo_icon.attached?

    self.logo_enabled = false
  end
end
