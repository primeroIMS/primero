# frozen_string_literal: true

I18n::Backend::Simple.include(I18n::Backend::Fallbacks)

EN_FALLBACK = %i[en].freeze
AR_FALLBACK = %i[ar en].freeze
ES_FALLBACK = %i[es en].freeze
KU_FALLBACK = %i[ku en].freeze
PT_FALLBACK = %i[pt en].freeze

I18n.fallbacks = {
  en: EN_FALLBACK,
  ar: EN_FALLBACK,
  'ar-IQ': AR_FALLBACK,
  'ar-LB': AR_FALLBACK,
  'ar-JO': AR_FALLBACK,
  'ar-SD': AR_FALLBACK,
  bn: EN_FALLBACK,
  es: EN_FALLBACK,
  'es-GT': ES_FALLBACK,
  'fa-AF': EN_FALLBACK,
  fr: EN_FALLBACK,
  id: EN_FALLBACK,
  km: EN_FALLBACK,
  ku: AR_FALLBACK,
  'ku-IQ': KU_FALLBACK,
  my: EN_FALLBACK,
  'ps-AF': EN_FALLBACK,
  pt: EN_FALLBACK,
  'pt-BR': PT_FALLBACK,
  so: EN_FALLBACK,
  'sw-KE': EN_FALLBACK,
  'sw-TZ': EN_FALLBACK,
  th: EN_FALLBACK
}.map { |key, val| [key, key == :en ? val : [key.to_sym] + val] }.to_h.with_indifferent_access
