
sysSettings = SystemSettings.all.first
I18n.default_locale = sysSettings.default_locale if sysSettings.present?
