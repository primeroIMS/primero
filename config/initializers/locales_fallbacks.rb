# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

I18n::Backend::Simple.include(I18n::Backend::Fallbacks)

EN_FALLBACK = %i[en].freeze
AR_FALLBACK = %i[ar en].freeze
ES_FALLBACK = %i[es en].freeze
KU_FALLBACK = %i[ku en].freeze
PT_FALLBACK = %i[pt en].freeze

I18n.fallbacks = {
  ne: EN_FALLBACK,
  en: EN_FALLBACK,
  'am-ET': EN_FALLBACK,
  ar: EN_FALLBACK,
  'ar-IQ': AR_FALLBACK,
  'ar-LB': AR_FALLBACK,
  'ar-JO': AR_FALLBACK,
  'ar-SD': AR_FALLBACK,
  'ar-SY': AR_FALLBACK,
  aeb: AR_FALLBACK,
  bn: EN_FALLBACK,
  es: EN_FALLBACK,
  'es-ES': ES_FALLBACK,
  'es-GT': ES_FALLBACK,
  'fa-AF': EN_FALLBACK,
  fr: EN_FALLBACK,
  hu: EN_FALLBACK,
  id: EN_FALLBACK,
  it: EN_FALLBACK,
  km: EN_FALLBACK,
  ku: AR_FALLBACK,
  'ku-IQ': KU_FALLBACK,
  my: EN_FALLBACK,
  om: EN_FALLBACK,
  pl: EN_FALLBACK,
  'ps-AF': EN_FALLBACK,
  pt: EN_FALLBACK,
  'pt-BR': PT_FALLBACK,
  ro: EN_FALLBACK,
  ru: EN_FALLBACK,
  sk: EN_FALLBACK,
  so: EN_FALLBACK,
  'sw-KE': EN_FALLBACK,
  'sw-TZ': EN_FALLBACK,
  th: EN_FALLBACK,
  uk: EN_FALLBACK,
  tr: EN_FALLBACK,
  cmn: EN_FALLBACK,
  tet: EN_FALLBACK
}.to_h { |key, val| [key, key == :en ? val : [key.to_sym] + val] }.with_indifferent_access
