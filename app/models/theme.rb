# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

class Theme < ApplicationRecord
  COLOR_PROPERTIES = %w[
    manifestThemeColor forgotPasswordLink networkIndicatorButton navListIconColor navDivider
    toolbarBackgroundColor toolbarBackgroundButtonColor navListBgActive navListTextActive
    navListIconActive navListText navListIcon navListDivider loginBackgroundGradientStart
    toolbarBackgroundColorMobileHeader drawerHeaderButton loginTranslationsButtonBackground
    loginTranslationsButtonText mobileToolbarBackground mobileToolbarHamburgerButton
  ]

  store_accessor :data, :site_description, :site_title, 
    :colors, :use_contained_nav_style, :show_powered_by_primero

  has_one_attached :login_background
  has_one_attached :logo
  has_one_attached :logo_white
  has_one_attached :logo_pictorial_144
  has_one_attached :logo_pictorial_192
  has_one_attached :logo_pictorial_256
  has_one_attached :favicon

  validate :valid_html_colors
  validates :login_background, presence: true
  validates :logo, presence: true
  validates :logo_white, presence: true
  validates :logo_pictorial_144, presence: true
  validates :logo_pictorial_192, presence: true
  validates :logo_pictorial_256, presence: true
  validates :favicon, presence: true

  def valid_html_colors
    return unless colors.present?
    invalid_color_keys = []
    colors_not_valid = colors.each{ |key, color| invalid_color_keys << key if !color.match(/#\h{6}/) }

    if invalid_color_keys.present?
      errors.add(:colors, "must be a valid hexadecimal color (#{invalid_color_keys.join(',')})")
    end
  end

  class << self
    def current
      where(disabled: false).order(created_at: :desc).first
    end
  end
end
