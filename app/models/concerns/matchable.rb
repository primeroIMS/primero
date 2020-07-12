# frozen_string_literal: true

# Describes records that can be used to do matches agains each other
# for duplicate detection and family tracing and reunification
module Matchable
  extend ActiveSupport::Concern

  # TODO: We'll need to pick one place where we calculate likelihood, and this ain't it
  LIKELY = 'likely'
  POSSIBLE = 'possible'
  LIKELIHOOD_THRESHOLD = 0.7
  NORMALIZED_THRESHOLD = 0.1
  #
  PHONETIC_FIELD_NAMES = %w[name name_nickname name_other relation_name relation_nickname].freeze

  # Sunspot/Solr configurations for fuzzy search
  module Searchable
    def configure_for_matching(field_name)
      text(field_name) { data[field_name] }
      return unless PHONETIC_FIELD_NAMES.include?(field_name)

      text(field_name, as: "#{field_name}_ph") { data[field_name] }
    end

    def configure_for_matching_from_subform(subform_field_name, field_name)
      text(field_name) do
        values_from_subform(subform_field_name, field_name)&.join(' ')
      end
      return unless PHONETIC_FIELD_NAMES.include?(field_name)

      text(field_name, as: "#{field_name}_ph") do
        value = values_from_subform(subform_field_name, field_name)&.join(' ')
        text(field_name, as: "#{field_name}_ph") { value }
      end
    end
  end

  module ClassMethods
    # TODO: Is the match map still relevant?
    MATCH_MAP = {
      'nationality' => 'relation_nationality',
      'language' => 'relation_language',
      'religion' => 'relation_religion',
      'ethnicity' => 'relation_ethnicity',
      'sub_ethnicity_1' => 'relation_sub_ethnicity1',
      'sub_ethnicity_2' => 'relation_sub_ethnicity2',
      'relation_nationality' => 'nationality',
      'relation_language' => 'language',
      'relation_religion' => 'religion',
      'relation_ethnicity' => 'ethnicity',
      'relation_sub_ethnicity1' => 'sub_ethnicity_1',
      'relation_sub_ethnicity2' => 'sub_ethnicity_2'
    }.freeze

    # MATCH_FIELDS = [
    #   { fields: %w[name name_other name_nickname], boost: 15 },
    #   { fields: ['sex'], boost: 10 },
    #   { fields: ['age'], boost: 10 },
    #   { fields: ['date_of_birth'], boost: 5 },
    #   { fields: %w[relation_name relation_nickname relation_other_family], boost: 10 },
    #   { fields: ['relation'], boost: 5 },
    #   { fields: ['relation_age'], boost: 5 },
    #   { fields: ['relation_date_of_birth'], boost: 5 },
    #   { fields: %w[nationality relation_nationality], boost: 3 },
    #   { fields: %w[language relation_language], boost: 3 },
    #   { fields: %w[religion relation_religion], boost: 3 },
    #   { fields: %w[ethnicity relation_ethnicity] },
    #   { fields: %w[sub_ethnicity_1 relation_sub_ethnicity1] },
    #   { fields: %w[sub_ethnicity_2 relation_sub_ethnicity2] }
    # ].freeze

    # TODO: The 4 methods below will be deprecated
    # def form_matchable_fields(match_fields = nil)
    #   form_match_fields(false, match_fields)
    # end

    # def subform_matchable_fields(match_fields = nil)
    #   form_match_fields(true, match_fields)
    # end

    # def matchable_fields
    #   form_matchable_fields.concat(subform_matchable_fields)
    # end

    # def find_match_records(match_criteria, match_class, child_id = nil, require_consent = true)
    #   pagination = { page: 1, per_page: 20 }
    #   sort = { score: :desc }
    #   if match_criteria.blank?
    #     []
    #   else
    #     search = Sunspot.search(match_class) do
    #       any do
    #         form_match_fields = match_class.matchable_fields
    #         match_criteria.each do |key, value|
    #           fields = match_class.get_match_field(key.to_s)
    #           fields = fields.select { |f| match_field_exist?(f, form_match_fields) }
    #           fulltext(value.join(' '), fields: fields) do
    #             minimum_match 1
    #           end
    #         end
    #       end
    #       with(:id, child_id) if child_id.present?
    #       with(:consent_for_tracing, true) if require_consent && match_class == Child
    #       sort.each { |sort_field, order| order_by(sort_field, order) }
    #       paginate pagination
    #     end
    #     results = {}
    #     search.hits.each { |hit| results[hit.result.id] = hit.score }
    #     results
    #   end
    # end

    # def phonetic_fields
    #   %w[name name_nickname name_other relation_name relation_nickname]
    # end

    # TODO: Is the match map still relevant?
    def map_match_field(field_name)
      MATCH_MAP[field_name] || field_name
    end

    # def get_match_field(field)
    #   match_field = MATCH_FIELDS.select { |f| f[:fields].include?(field.to_s) }.first
    #   match_field.blank? ? [field] : match_field[:fields]
    # end

    # def get_field_boost(field)
    #   default_boost_value = 1
    #   boost_field = MATCH_FIELDS.select { |f| f[:fields].include?(field.to_s) }.first
    #   boost_field.blank? ? default_boost_value : boost_field[:boost]
    # end

    # def match_field_exist?(field, field_list)
    #   # field must be present in the match_class matchable_fields to perform fulltext search.
    #   field_list.include?(field.to_s)
    # end

    # def match_multi_value(field, match_request)
    #   if match_request.respond_to?(:data)
    #     match_request.data[field].is_a?(Array) ? match_request.data[field].join(' ') : match_request.data[field]
    #   else
    #     match_request[field].is_a?(Array) ? match_request[field].join(' ') : match_request[field]
    #   end
    # end

    # def match_multi_criteria(field, match_request)
    #   cluster_field = field
    #   result = [match_multi_value(field, match_request)]
    #   if result.first.present?
    #     match_field = MATCH_FIELDS.select { |f| f[:fields].include?(field) }.first
    #     if match_field.present?
    #       result += match_field[:fields].reject { |f| f == field }.map do |f|
    #         match_multi_value(f, match_request)
    #       end
    #       cluster_field = match_field[:fields].first
    #     end
    #   end
    #   [cluster_field, result.reject(&:blank?)]
    # end

    # def phonetic_fields_exist?(field)
    #   phonetic_fields.include?(field.to_s)
    # end

    # def form_match_fields(is_subform, match_fields)
    #   fields = MatchingConfiguration.matchable_fields(parent_form, is_subform).map(&:name)
    #   return fields if match_fields.blank?

    #   fields & match_fields.values.flatten.reject(&:blank?)
    # end
  end

  # def match_criteria(match_request = self, match_fields = nil)
  #   match_criteria = {}
  #   self.class.form_matchable_fields(match_fields).each do |field|
  #     match_field, match_value = self.class.match_multi_criteria(field, match_request)
  #     match_criteria[:"#{match_field}"] = match_value if match_value.present?
  #   end
  #   match_criteria.compact
  # end

  # Matching service type functionality
  # TODO: Move to a service
  class Utils
    def self.calculate_likelihood(score, aggregate_average_score)
      (score - aggregate_average_score) > LIKELIHOOD_THRESHOLD ? LIKELY : POSSIBLE
    end

    # TODO: Is this logic duplicated with PotentialMatch.matches_from_search
    def self.normalize_search_result(search_result)
      records = []
      if search_result.present?
        scores = search_result.values
        max_score = scores.max
        normalized_search_result = search_result.map { |k, v| [k, v / max_score.to_f] }
        average_score = normalized_search_result.to_h.values.sum / scores.count
        thresholded_search_result = normalized_search_result.select { |_, v| v > NORMALIZED_THRESHOLD }
        thresholded_search_result.each do |id, score|
          records << yield(id, score, average_score)
        end
      end
      records
    end
  end
end
