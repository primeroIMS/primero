module Matchable
  extend ActiveSupport::Concern

  module ClassMethods

    #This method controls trace matching logic
    def build_match(match={}, params)
      phonetic_fields = { name_ph: match[:name], name_nickname_ph: match[:name_nickname] }

      # The score property will give more weight to that field during matching.
      # TODO: Figure out if we need to make certain fields more relevant than others.
      #
      # In Child Model
      # def self.match_boost_fields
      #   [
      #       {field: 'ethnicity', match: 'ethnicity', boost: 0.5},
      #       {field: 'sub_ethnicity_1', match: 'ethnicity', boost: 0.5},
      #       {field: 'sub_ethnicity_2', match: 'ethnicity', boost: 0.5},
      #       {field: 'date_of_birth', match: 'date_of_birth', boost: 0.5, date:true}
      #   ]
      # end

      params[:bq] = boost_query_fields(match, true)

      params[:q] = if phonetic_fields.values.any?{|m| m.present?}
                     phonetic_fields.compact.map{|k, v| "#{k}:(#{v})"}.join(' OR ')
                   else
                     boost_query_fields(match, false)
                   end

      params[:defType] = "edismax"
      params[:fl] = "* score"
      params
    end

    def boost_query_fields(match, include_boost)
      fields = build_boost_fields_with_match_value(match).map do |k, v|
        if v[:value].present?
          value = v[:value].is_a?(Array) ? v[:value].join(' OR ') : v[:value]
          if v[:score].present? && include_boost.present?
            v[:date].present? ? "#{k}:[#{value}]^#{v[:boost]}" : "#{k}:(#{value})^#{v[:boost]}"
          else
            v[:date].present? ? "#{k}:[#{value}]" : "#{k}:(#{value})"
          end
        end
      end
      fields.compact.join(' OR ')
    end

    def build_boost_fields_with_match_value(match)
      fields = {}
      self.match_boost_fields.each do |bf|
        field = SolrUtils.indexed_field_name(self, bf[:field])
        if field.present?
          # This may have to change if matching on a single date and not a range.
          value = match[bf[:match].to_sym]
          if bf[:date].present? && value.present?
            # To satisfy solr, dates needed to formated to utc iso8601
            to = (value + 2.years).to_time.utc.iso8601
            from = (value - 2.years).to_time.utc.iso8601
            fields[field] = {value: "#{from} TO #{to}", boost: bf[:boost], date: bf[:date]}
          else
            fields[field] = {value: value, boost: bf[:boost]}
          end
        end
      end
      fields
    end

    def match_boost_fields
      #To be overridden by including model
      []
    end

    def form_matchable_fields
      form_fields = FormSection.get_matchable_fields_by_parent_form(self.parent_form, false)
      Array.new(form_fields).map(&:name)
    end

    def subform_matchable_fields
      form_fields = FormSection.get_matchable_fields_by_parent_form(self.parent_form)
      Array.new(form_fields).map(&:name)
    end

    def matchable_fields
      form_matchable_fields.concat(subform_matchable_fields)
    end

    def all_matches(associated_user_names)
      pagination = {page: 1, per_page: self.count}
      search = self.search do
        if associated_user_names.present? && associated_user_names.first != 'all'
          any_of do
            associated_user_names.each do |user_name|
              with(:associated_user_names, user_name)
            end
          end
        end
        paginate pagination
      end

      results = match_results(search.results)
    end

    #To be overidden in included model
    def match_results(results)
      []
    end

    def find_match_records(match_criteria, match_class, child_id = nil)
      pagination = {:page => 1, :per_page => 20}
      sort={:score => :desc}
      if match_criteria.blank?
        []
      else
        search = Sunspot.search(match_class) do
          any do
            match_criteria.each do |key, value|
              fulltext(value, :fields => match_class.get_match_field(key.to_s))
            end
          end
          with(:id, child_id) if child_id.present?
          sort.each { |sort_field, order| order_by(sort_field, order) }
          paginate pagination
        end
        results = {}
        search.hits.each { |hit| results[hit.result.id] = hit.score }
        results
      end
    end

    def is_match_visible? owner, associated_user_names
      return (associated_user_names.first == 'all' || associated_user_names.include?(owner))
    end

    def compact_result match_results
      match_results.delete_if { |h| h["match_details"].length == 0 }
      match_results
    end

    def sort_hash match_results
      match_results = match_results.sort_by { |hash| -find_max_score_element(hash["match_details"])["average_rating"] }
      match_results
    end

    def find_max_score_element array
      array = array.max_by do |element|
        element["average_rating"]
      end
      array
    end

    def boost_fields
      []
    end

    def exclude_match_field(field)
      boost_field = boost_fields.select { |f| f[:field] == field }
      boost_field.empty? || boost_field.first[:match].nil?
    end

    def get_match_field(field)
      boost_field = boost_fields.select { |f| f[:field] == field }
      boost_field.empty? ? field : (boost_field.first[:match] || boost_field.first[:field]).to_sym
    end

    def get_field_boost(field)
      default_boost_value = 1
      boost_field = boost_fields.select { |f| f[:field] == field }
      boost_field.empty? ? default_boost_value : (boost_field.first[:boost] || default_boost_value)
    end
  end
end