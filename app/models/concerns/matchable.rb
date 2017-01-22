module Matchable
  extend ActiveSupport::Concern

  module ClassMethods

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
      [
        {field: 'name', boost: 10},
        {field: 'name_first', match: 'name', boost: 10},
        {field: 'name_middle', match: 'name', boost: 10},
        {field: 'name_last', match: 'name', boost: 10},
        {field: 'name_other', match: 'name', boost: 10},
        {field: 'name_nickname', boost: 10},
        {field: 'sex', boost: 10},
        {field: 'age', boost: 5},
        {field: 'date_of_birth', boost: 5},
        {field: 'relation_name', boost: 5},
        {field: 'relation', boost: 10},
        {field: 'relation_nickname', boost: 5},
        {field: 'relation_age', boost: 5},
        {field: 'relation_date_of_birth', boost: 5},
        {field: 'relation_other_family', match: 'relation_name', boost: 5},
        {field: 'nationality', match: 'relation_nationality', boost: 3},
        {field: 'language', match: 'relation_language', boost: 3},
        {field: 'religion', match: 'relation_religion', boost: 3},
        {field: 'ethnicity', match: 'relation_ethnicity'},
        {field: 'sub_ethnicity_1', match: 'relation_sub_ethnicity1'},
        {field: 'sub_ethnicity_2', match: 'relation_sub_ethnicity2'}
      ]
    end

    def exclude_match_field(field)
      boost_field = boost_fields.select { |f| f[:field] == field }
      boost_field.empty? || boost_field.first[:match].nil?
    end

    def get_match_field(field)
      boost_field = boost_fields.select { |f| f[:field] == field }
      #TODO: v1.3 potentially uncomment line below if we want to do a reverse mapping
      #boost_field = boost_fields.select { |f| f[:match] == field } unless boost_field.present?
      boost_field.empty? ? field : (boost_field.first[:match] || boost_field.first[:field]).to_sym
    end

    def get_field_boost(field)
      default_boost_value = 1
      boost_field = boost_fields.select { |f| f[:field] == field }
      boost_field.empty? ? default_boost_value : (boost_field.first[:boost] || default_boost_value)
    end
  end
end