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

  class << self
    def strip_diacritics(value)
      strip_arabic_vowels(value.unicode_normalize(:nfc).tr(DIACRITICS[:from], DIACRITICS[:to]))
    end

    def strip_arabic_vowels(value)
      value.tr(ARABIC_VOWELS, '')
    end

    def latin?(value)
      value.gsub(/[^a-zA-Z]/, '').present?
    end

    def tokenize(value)
      value&.split&.map do |elem|
        diacriticless = strip_diacritics(elem)
        # NOTE: Text::Metaphone produces upcase strings. Upcasing to keep consistent output.
        next(diacriticless.upcase) unless latin?(elem)

        Text::Metaphone.double_metaphone(diacriticless).first
      end
    end
  end
end
