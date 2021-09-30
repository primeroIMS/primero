# frozen_string_literal: true

# Use Solr fuzzy search to find records similar to this record given some field citeria.
# This is used for duplicate detection and matching of child tracing requests to child cases.
class MatchingService
  MATCH_FIELDS = [
    { fields: %w[name name_other name_nickname], boost: 15.0 },
    { fields: ['sex'], boost: 10.0 },
    { fields: ['age'], boost: 10.0 },
    { fields: ['date_of_birth'], boost: 5.0 },
    { fields: %w[relation_name relation_nickname relation_other_family], boost: 10.0 },
    { fields: ['relation'], boost: 5.0 },
    { fields: ['relation_age'], boost: 5.0 },
    { fields: ['relation_date_of_birth'], boost: 5.0 },
    { fields: %w[nationality relation_nationality], boost: 3.0 },
    { fields: %w[language relation_language], boost: 3.0 },
    { fields: %w[religion relation_religion], boost: 3.0 },
    { fields: %w[ethnicity relation_ethnicity] },
    { fields: %w[sub_ethnicity_1 relation_sub_ethnicity1] },
    { fields: %w[sub_ethnicity_2 relation_sub_ethnicity2] }
  ].freeze

  NORMALIZED_THRESHOLD = 0.1
  LIKELIHOOD_THRESHOLD = 0.7
  LIKELY = 'likely'
  POSSIBLE = 'possible'

  def self.matches_for(matchable)
    MatchingService.new.matches_for(matchable)
  end

  def matches_for(matchable)
    match_result = find_match_records(matchable.match_criteria, matchable.matches_to)
    normalize_search_results(match_result).map do |id, normalized|
      match = matchable.matches_to.find_by(id: id)
      params = normalized.clone
      params.store(make_key(matchable), matchable)
      params.store(make_key(match), match)
      PotentialMatch.new(params)
    end
  end

  def normalize_search_results(results)
    return {} unless results.present?

    normalized_search_result = results.map { |k, v| [k, v / results.values.max.to_f] }
    thresholded_search_result = normalized_search_result.select { |_, v| v > NORMALIZED_THRESHOLD }
    thresholded_search_result.map do |id, score|
      [id, { score: score, likelihood: likelihood(score, average_score(results), thresholded_search_result.size) }]
    end.to_h
  end

  def average_score(results)
    scores = results.values
    scores.reduce(0) { |sum, x| sum + (x / scores.max.to_f) } / scores.count.to_f
  end

  def likelihood(score, average_score, result_size)
    return LIKELY if result_size == 1

    (score - average_score) > LIKELIHOOD_THRESHOLD ? LIKELY : POSSIBLE
  end

  def find_match_records(match_criteria, match_class, require_consent = true)
    return {} if match_criteria.blank?

    search(match_criteria, match_class, require_consent).hits.map do |hit|
      [hit.result.id, hit.score]
    end.to_h
  end

  # Almost never disable Rubocop, but Sunspot queries are what they are.
  # rubocop:disable Metrics/AbcSize
  # rubocop:disable Metrics/MethodLength
  def search(match_criteria, match_class, require_consent)
    this = self
    Sunspot.search(match_class) do
      any do
        match_criteria.each do |key, value|
          match_fields = this.match_field_names(key.to_s)
          fulltext(value) do
            fields(*match_fields)
            matched_boost_fields = this.match_field_boost(key.to_s)
            boost_fields(matched_boost_fields) if matched_boost_fields.present?
            minimum_match(1)
          end
        end
      end
      with(:consent_for_tracing, true) if require_consent && match_class == Child
      order_by(:score, :desc)
      paginate(page: 1, per_page: 20)
    end
  end
  # rubocop:enable Metrics/AbcSize
  # rubocop:enable Metrics/MethodLength

  def match_field_names(field_name)
    match_field = MATCH_FIELDS.find(-> { { fields: [field_name] } }) do |f|
      f[:fields].include?(field_name)
    end
    match_field[:fields].map { |f| "#{f}_matchable" }
  end

  def match_field_boost(field_name)
    boost_field = MATCH_FIELDS.find { |f| f[:fields].include?(field_name) }
    return unless boost_field.present?

    boost_field[:fields].map { |f| ["#{f}_matchable", boost_field[:boost]] }.to_h
  end

  def make_key(record)
    record.class.name.downcase.to_sym
  end
end
