# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# A service to strip diacritic marks from various languages
class LanguageService
  # rubocop:disable Layout/HashAlignment
  # rubocop:disable Layout/LineLength
  LATIN_GREEK = {
    from: 'ÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÑÒÓÔÕÖØÙÚÛÜÝàáâãäåæçèéêëìíîïñòóôõöøùúûüýÿΆΈΊΌΐάέήίΰϊϋόύώỏἀἁἂἃἄἅἆἈἉἊἌἍἎἐἑἒἓἔἕἘἙἜἝἠἡἢἣἤἥἦἧἨἩἫἬἭἮἯἰἱἲἳἴἵἶἷἸἹἼἽἾὀὁὂὃὄὅὈὉὊὋὌὍὐὑὓὔὕὖὗὙὝὠὡὢὣὤὥὦὧὨὩὫὬὭὮὯὰὲὴὶὸὺὼᾐᾑᾓᾔᾕᾖᾗᾠᾤᾦᾧᾰᾱᾳᾴᾶᾷᾸᾹῂῃῄῆῇῐῑῒῖῗῘῙῠῡῢῥῦῨῩῬῳῴῶῷῸ',
    to:   'AAAAAAÆCEEEEIIIINOOOOOOUUUUYaaaaaaæceeeeiiiinoooooouuuuyyΑΕΙΟιαεηιυιυουωoαααααααΑΑΑΑΑΑεεεεεεΕΕΕΕηηηηηηηηΗΗΗΗΗΗΗιιιιιιιιΙΙΙΙΙοοοοοοΟΟΟΟΟΟυυυυυυυΥΥωωωωωωωωΩΩΩΩΩΩΩαεηιουωηηηηηηηωωωωααααααΑΑηηηηηιιιιιΙΙυυυρυΥΥΡωωωωΟ'
  }.freeze

  ARABIC_VOWELS = 'ًٌٍَُِّْ'.strip

  CYRILLIC = {
    from: 'ҐЁЇЙґёїй',
    to:   'ГЕІИгеіи'
  }.freeze
  # rubocop:enable Layout/HashAlignment
  # rubocop:enable Layout/LineLength

  DIACRITICS = {
    from: LATIN_GREEK[:from] + CYRILLIC[:from],
    to: LATIN_GREEK[:to] + CYRILLIC[:to]
  }.freeze

  def self.strip_diacritics(value)
    strip_arabic_vowels(value.unicode_normalize(:nfc).tr(DIACRITICS[:from], DIACRITICS[:to]))
  end

  def self.strip_arabic_vowels(value)
    value.tr(ARABIC_VOWELS, '')
  end

  def self.latin?(value)
    value.gsub(/[^a-zA-Z]/, '').present?
  end
end
