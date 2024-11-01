# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# Service for getting properties from theme
class ThemeService
  attr_accessor :theme

  def initialize
    self.theme = Rails.configuration.use_theme ? Theme.current : Theme.default
  end

  def t(key, locale)
    theme.data.dig(key, locale) || theme.data.dig(key, I18n.locale.to_s) || ''
  end

  def get(key, default_value = '')
    theme.data[key] || default_value
  end
end
