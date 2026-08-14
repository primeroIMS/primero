# frozen_string_literal: true

# Generates valid PostgreSQL column aliases. This is useful when we are dynamically fetching data
# from JSONB properties and need to perform aggregations or sorting over those properties.
class Reports::AliasGenerator
  PG_MAX_IDENTIFIER_LENGTH = 62
  AFFIX_MAX_LENGTH = 6

  def self.generate(field_name, prefix = nil, suffix = nil)
    new(field_name, prefix, suffix).generate
  end

  def initialize(field_name, prefix, suffix)
    @field_name = field_name
    @prefix = prefix
    @suffix = suffix
  end

  def generate
    original_alias = [@prefix, @field_name, @suffix].compact.join('_')
    return original_alias if original_alias.length <= PG_MAX_IDENTIFIER_LENGTH

    random_hash = SecureRandom.hex(2)
    short_prefix = truncate_affix(@prefix)
    short_suffix = truncate_affix(@suffix)
    affixes_length = [short_suffix, short_prefix, random_hash].sum(&:length)
    max_field_name_length = PG_MAX_IDENTIFIER_LENGTH - affixes_length
    [short_prefix, @field_name.slice(0, max_field_name_length), random_hash, short_suffix].compact.join('_')
  end

  def truncate_affix(affix)
    return '' unless affix.present?
    return affix unless affix.length > AFFIX_MAX_LENGTH

    affix.slice(0, 5)
  end
end
