# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# Model for Theme
# rubocop:disable Naming/VariableNumber
class Theme < ApplicationRecord
  COLOR_PROPERTIES = %w[
    manifestThemeColor forgotPasswordLink networkIndicatorButton navListIconColor navDivider
    toolbarBackgroundColor toolbarBackgroundButtonColor navListBgActive navListTextActive
    navListIconActive navListText navListIcon navListDivider loginBackgroundGradientStart
    loginBackgroundGradientEnd toolbarBackgroundColorMobileHeader drawerHeaderButton
    loginTranslationsButtonBackground loginTranslationsButtonText mobileToolbarBackground
    mobileToolbarHamburgerButton loginButtonBg loginButtonText
  ].freeze

  DEFAULT_THEME = {
    show_powered_by_primero: false,
    use_contained_nav_style: false,
    site_title: 'Primero',
    product_name: 'Primero',
    system_name: nil,
    site_description: { en: I18n.t('email.site_description', locale: :en) },
    email_disclaimer_pre: { en: I18n.t('email.email_disclaimer_pre', locale: :en) },
    email_disclaimer: { en: '' },
    email_copyright: { en: '' },
    email_warning: { en: '' },
    email_welcome_greeting: { en: I18n.t('email.email_welcome_greeting', locale: :en) },
    email_welcome_closing: { en: I18n.t('email.email_welcome_closing', locale: :en) },
    email_instructional_video: '',
    email_closing: { en: I18n.t('email.email_closing', locale: :en) },
    email_signature: { en: I18n.t('email.email_signature', locale: :en) },
    email_admin_name: { en: I18n.t('email.email_admin_name', locale: :en) },
    email_help_links: [],
    email_link_color: '#0093B8',
    email_footer_background_color: '#F3F3F3',
    email_help_link_background_color: '#F8FCFD',
    colors: {
      'manifestThemeColor' => '#0093ba'
    },
    revision: SecureRandom.uuid
  }.with_indifferent_access.freeze

  PICTORIAL_SIZES = %w[144 192 256].freeze

  attr_accessor :bypass_logos

  store_accessor :data, :site_description, :site_title, :colors, :use_contained_nav_style, :show_powered_by_primero,
                 :revision, :email_link_color, :email_footer_background_color, :email_help_link_background_color,
                 :email_help_links, :email_signature, :email_closing, :email_welcome_greeting,
                 :email_warning, :email_copyright, :email_disclaimer, :email_disclaimer_pre, :email_admin_name,
                 :email_welcome_closing, :email_instructional_video, :product_name, :system_name

  has_one_attached :login_background
  has_one_attached :logo
  has_one_attached :logo_white
  has_one_attached :logo_pictorial_144
  has_one_attached :logo_pictorial_192
  has_one_attached :logo_pictorial_256
  has_one_attached :favicon

  validate :valid_html_colors
  validates :logo, presence: true, unless: :bypass_logos
  validates :logo_white, presence: true, unless: :bypass_logos
  validates :logo_pictorial_144, presence: true, unless: :bypass_logos
  validates :logo_pictorial_192, presence: true, unless: :bypass_logos
  validates :logo_pictorial_256, presence: true, unless: :bypass_logos
  validates :favicon, presence: true, unless: :bypass_logos
  # rubocop:enable Naming/VariableNumber

  before_save :generate_new_revision

  def generate_new_revision
    self.revision = SecureRandom.uuid
  end

  def valid_html_colors
    return unless colors.present?

    invalid_color_keys = []
    colors.each { |key, color| invalid_color_keys << key unless color.match(/#\h{6}/) }

    return unless invalid_color_keys.present?

    errors.add(:colors, "must be a valid hexadecimal color (#{invalid_color_keys.join(',')})")
  end

  def site_name
    system_name || product_name
  end

  def t(key, locale)
    data.dig(key, locale) || data.dig(key, I18n.default_locale.to_s) ||
      DEFAULT_THEME.dig(key, 'en') || ''
  end

  def get(key, default_value = '')
    data[key] || default_value
  end

  class << self
    def current
      @current ||= if Rails.configuration.use_theme
                     where(disabled: false).order(created_at: :desc).first
                   else
                     new(DEFAULT_THEME)
                   end
    end

    def create_or_update!(hash = {})
      theme = current || new(DEFAULT_THEME)
      theme.assign_attributes(hash)
      theme.save!
      theme
    end
  end
end
