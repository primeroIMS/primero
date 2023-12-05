# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# Model for Theme
# rubocop:disable Naming/VariableNumber
class Theme < ApplicationRecord
  COLOR_PROPERTIES = %w[
    manifestThemeColor forgotPasswordLink networkIndicatorButton navListIconColor navDivider
    toolbarBackgroundColor toolbarBackgroundButtonColor navListBgActive navListTextActive
    navListIconActive navListText navListIcon navListDivider loginBackgroundGradientStart
    toolbarBackgroundColorMobileHeade r drawerHeaderButton loginTranslationsButtonBackground
    loginTranslationsButtonText mobileToolbarBackground mobileToolbarHamburgerButton
  ].freeze

  DEFAULT_THEME = {
    show_powered_by_primero: false,
    use_contained_nav_style: false,
    site_title: 'Primero',
    site_description: 'Primero is an open source software platform that helps social services,
    humanitarian and development workers manage protection-related data, with tools that facilitate case management,
    incident monitoring and family tracing and reunification.',
    colors: {
      'manifestThemeColor' => '#0093ba'
    }
  }.freeze

  PICTORIAL_SIZES = %w[144 192 256].freeze

  store_accessor :data, :site_description, :site_title, :colors, :use_contained_nav_style, :show_powered_by_primero

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
  # rubocop:enable Naming/VariableNumber

  def valid_html_colors
    return unless colors.present?

    invalid_color_keys = []
    colors.each { |key, color| invalid_color_keys << key unless color.match(/#\h{6}/) }

    return unless invalid_color_keys.present?

    errors.add(:colors, "must be a valid hexadecimal color (#{invalid_color_keys.join(',')})")
  end

  class << self
    def default
      @default ||= new(DEFAULT_THEME)
    end

    def current
      where(disabled: false).order(created_at: :desc).first
    end
  end
end
