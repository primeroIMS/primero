sysSettings = SystemSettings.first
I18n.default_locale = sysSettings.default_locale if sysSettings.present?
