# frozen_string_literal: true

I18n::Backend::Simple.include(I18n::Backend::Fallbacks)

EN_FALLBACK = %i[en].freeze
AR_FALLBACK = %i[ar en].freeze
PT_FALLBACK = %i[pt en].freeze

I18n.fallbacks = {
  en: EN_FALLBACK,
  ar: EN_FALLBACK,
  "ar-LB": AR_FALLBACK,
  fr: EN_FALLBACK,
  so: EN_FALLBACK,
  es: EN_FALLBACK,
  bn: EN_FALLBACK,
  id: EN_FALLBACK,
  my: EN_FALLBACK,
  th: EN_FALLBACK,
  ku: AR_FALLBACK,
  'ar-SD': AR_FALLBACK,
  'ar-JO': AR_FALLBACK,
  'fa-AF': EN_FALLBACK,
  'ps-AF': EN_FALLBACK,
  pt: EN_FALLBACK,
  'pt-BR': PT_FALLBACK
}.map { |key, val| [key, key == :en ? val : [key.to_sym] + val] }.to_h.with_indifferent_access
