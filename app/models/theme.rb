class Theme < ApplicationRecord

  store_accessor :data, :site_description, :site_title, 
    :colors, :use_contained_nav_style, :show_powered_by_primero

  has_one_attached :js_config
  has_one_attached :login_background
  has_one_attached :logo
  has_one_attached :logo_white
  has_one_attached :logo_pictorial_144
  has_one_attached :logo_pictorial_192
  has_one_attached :logo_pictorial_256
  has_one_attached :favicon

  validate :valid_hex_values

  def valid_hex_values
    invalid_color_keys = []
    colors_not_valid = colors.each{ |key, color| invalid_color_keys << key if !color.match(/#\h{6}/) }

    if invalid_color_keys.present?
      errors.add(:colors, "must be a valid hexadecimal color (#{invalid_color_keys.join(',')})")
    end
  end

  class << self
    def active
      find_by(is_active: true)
    end
  end
end
