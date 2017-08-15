# For defined Primero locales, regional locales such as :"ar-LB" fall back to the
# simplified language locale (:ar). All locales fall back to :en.
#
# Primero uses I18n.default_locale to store the configurable application-wide locale,
# rather than the real default locale which is assumed/hard-coded to be English (:en).

I18n.backend.class.send(:include, I18n::Backend::Fallbacks)
I18n.fallbacks.clear

Primero::Application::LOCALES.each do |locale|
  chain = []
  region = locale.split('-')
  if region.size > 1
    chain << region[0].to_sym
  end
  unless locale == 'en'
    chain << :en
    I18n.fallbacks.map(locale.to_sym => chain)
  end
end
