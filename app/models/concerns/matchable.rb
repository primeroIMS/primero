module Matchable
  extend ActiveSupport::Concern

  module ClassMethods

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
      'relation_sub_ethnicity1' =>'sub_ethnicity_1',
      'relation_sub_ethnicity2' => 'sub_ethnicity_2'
    }

    def form_matchable_fields
      form_fields = FormSection.get_matchable_fields_by_parent_form(self.parent_form, false)
      Array.new(form_fields).map(&:name)
    end

    def subform_matchable_fields
      form_fields = FormSection.get_matchable_fields_by_parent_form(self.parent_form, true)
      Array.new(form_fields).map(&:name)
    end

    def matchable_fields
      form_matchable_fields.concat(subform_matchable_fields)
    end

    def find_match_records(match_criteria, match_class, child_id = nil)
      pagination = {:page => 1, :per_page => 20}
      sort={:score => :desc}
      if match_criteria.blank?
        []
      else
        search = Sunspot.search(match_class) do
          any do
            match_fields = match_class.matchable_fields
            match_criteria.each do |key, value|
              field = match_class.get_match_field(key.to_s)
              fulltext(value, :fields => field) if match_field_exist?(field, match_fields)
            end
          end
          with(:id, child_id) if child_id.present?
          with(:consent_for_tracing, true)
          sort.each { |sort_field, order| order_by(sort_field, order) }
          paginate pagination
        end
        results = {}
        search.hits.each { |hit| results[hit.result.id] = hit.score }
        results
      end
    end

    def boost_fields
      [
        {field: 'name', boost: 10},
        {field: 'name_first', match: 'name', boost: 10},
        {field: 'name_middle', match: 'name', boost: 10},
        {field: 'name_last', match: 'name', boost: 10},
        {field: 'name_other', boost: 10},
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

    def phonetic_fields
      ['name', 'name_nickname', 'name_other', 'relation_name', 'relation_nickname']
    end

    def map_match_field(field_name)
      MATCH_MAP[field_name] || field_name
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

    def match_field_exist?(field, field_list)
      field_list.include?(field.to_s)
    end

    def phonetic_fields_exist?(field)
      phonetic_fields.include?(field.to_s)
    end
  end

  def match_criteria(match_request=nil)
    match_criteria = {}
    self.class.form_matchable_fields.each do |field|
      match_criteria[:"#{field}"] = (self[:"#{field}"].is_a? Array) ? self[:"#{field}"].join(' ') : self[:"#{field}"]
    end
    match_criteria.compact
  end

end