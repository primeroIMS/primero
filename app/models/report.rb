class Report < ApplicationRecord

  # include Memoizable
  include LocalizableJsonProperty
  include Configuration

  REPORTABLE_FIELD_TYPES = [
    #Field::TEXT_FIELD,
    #Field::TEXT_AREA,
    Field::RADIO_BUTTON,
    Field::SELECT_BOX,
    Field::NUMERIC_FIELD,
    Field::DATE_FIELD,
    #Field::DATE_RANGE,
    Field::TICK_BOX,
    Field::TALLY_FIELD,
  ]

  AGGREGATE_COUNTS_FIELD_TYPES = [
    Field::NUMERIC_FIELD,
    Field::TALLY_FIELD,
  ]

  DAY = 'date' #eg. 13-Jan-2015
  WEEK = 'week' #eg. Week 2 Jan-2015
  MONTH = 'month' #eg. Jan-2015
  YEAR = 'year' #eg. 2015
  DATE_RANGES = [DAY, WEEK, MONTH, YEAR]

  localize_properties :name, :description

  #TODO: Currently it's not worth trying to save off the report data.
  #      The report builds a value hash with an array of strings as keys. CouchDB/CouchRest converts this array to a string.
  #      Not clear what benefit could be gained by storing the data but converting keys to strings on the fly
  #      when rendering the graph and table. So for now we will rebuild the data.
  #property :data
  attr_accessor :data
  attr_accessor :add_default_filters
  attr_accessor :aggregate_by_ordered
  attr_accessor :disaggregate_by_ordered
  attr_accessor :permission_filter

  validates_presence_of :record_type
  validates_presence_of :aggregate_by
  validate :modules_present
  validate :validate_name_in_base_language

  before_save :apply_default_filters

  def validate_name_in_base_language
    return true if self.send("name_#{Primero::Application::BASE_LANGUAGE}").present?
    errors.add(:name, I18n.t("errors.models.report.name_presence"))
    return false
  end

  class << self

    def create_or_update(report_hash)
      report_id = report_hash[:id]
      report = Report.find_by(id: report_id)
      if report.nil?
        Report.create! report_hash
      else
        report.update_attributes report_hash
      end
    end

    def get_reportable_subform_record_field_name(model, record_type)
      model = Record::model_from_name(model)
      if model.try(:nested_reportable_types)
        return model.nested_reportable_types.select{|nrt| nrt.model_name.param_key == record_type}.first.try(:record_field_name)
      end
    end

    def get_reportable_subform_record_field_names(model)
      model = Record::model_from_name(model)
      if model.try(:nested_reportable_types)
        return model.nested_reportable_types.map{|nrt| nrt.model_name.param_key}
      end
    end

    def record_type_is_nested_reportable_subform?(model, record_type)
      get_reportable_subform_record_field_names(model).include?(record_type)
    end

    def get_all_nested_reportable_types
      record_types = []
      FormSection::RECORD_TYPES.each do |rt|
        record_types = record_types + Record.model_from_name(rt).try(:nested_reportable_types)
      end
      record_types
    end
  end

  def modules
    @modules ||= PrimeroModule.all(keys: [self.module_id]).all if self.module_id.present?
  end

  def field_map
    return @pivot_fields
  end

  # This method transforms the current values format: {["child_mother", "female"] => 1}
  # to a nested hash: { "child_mother" => { "female" =>{ "_total" => 1 } } }
  def hashed_values
    values_tree = {}
    self.values
        .select{ |k,_| k.select{ |e| e.to_s.present? }.present? } # Remove empty arrays ["", ""]
        .each do |key, total|
          key.each_with_index do |key_value, index|
            new_value = (key_value == key.last) ? { key_value => { "_total" => total } } : { key_value => {} }
            values_tree = new_value if values_tree.blank?
            if index.zero?
              if !self.has_key_at_level?(values_tree, nil, key_value, index)
                values_tree = values_tree.merge(new_value)
              end
            else
              if key_value.to_s.blank?
                # Get the last non empty value as the parent_key
                parent_key, tree_level = key.each_with_index.select { |k,i| k.to_s.present? }.last
                parent_tree = self.get_tree_level(values_tree, tree_level)
                parent_tree[parent_key]["_total"] = total
              elsif !self.has_key_at_level?(values_tree, key[index - 1], key_value, (index - 1))
                parent_tree = self.get_tree_level(values_tree, index - 1)
                parent_tree[key[index - 1]] = parent_tree[key[index - 1]].merge(new_value)
              end
            end
          end
        end
    values_tree
  end

  def has_key_at_level?(tree, parent_key, key, level)
    tree = self.get_tree_level(tree, level)
    return false if tree.blank? || (parent_key.present? && tree[parent_key].blank?)
    parent_key.present? ? tree[parent_key].has_key?(key) : tree.has_key?(key)
  end

  def get_tree_level(tree, level)
    return tree if level <= 0
    level.times do
      return nil if tree.values.blank?
      tree = tree.values.inject(&:merge)
    end
    tree
  end

  # Run the Solr query that calculates the pivots and format the output.
  #TODO: Break up into self contained, testable methods
  def build_report
    # Prepopulates pivot fields
    pivot_fields

    sys = SystemSettings.current
    primary_range = sys.primary_age_range
    age_ranges = sys.age_ranges[primary_range]

    if permission_filter.present?
      filters << permission_filter
    end
    if pivots.present?
      self.values = report_values(record_type, pivots, filters)
      if aggregate_counts_from.present?
        if dimensionality < ((aggregate_by + disaggregate_by).size + 1)
          #The numbers are off because a dimension is missing. Zero everything out!
          self.values = self.values.map{|pivots, _| [pivots, 0]}
        end
        aggregate_counts_from_field = Field.find_by_name(aggregate_counts_from)
        if aggregate_counts_from_field.present?
          if aggregate_counts_from_field.type == Field::TALLY_FIELD
            self.values = self.values.map do |pivots, value|
              if pivots.last.present? && pivots.last.match(/\w+:\d+/)
                tally = pivots.last.split(':')
                value = value * tally[1].to_i
              end
              [pivots, value]
            end.to_h
            self.values = Reports::Utils.group_values(self.values, dimensionality-1) do |pivot_name|
              pivot_name.split(':')[0]
            end
            self.values = Reports::Utils.correct_aggregate_counts(self.values)
          elsif aggregate_counts_from_field.type == Field::NUMERIC_FIELD
            self.values = self.values.map do |pivots, value|
              if pivots.last.is_a?(Numeric)
                value = value * pivots.last
              elsif pivots.last == ""
                value = 0
              end
              [pivots, value]
            end.to_h
            self.values = Reports::Utils.group_values(self.values, dimensionality-1) do |pivot_name|
              (pivot_name.is_a? Numeric) ? "" : pivot_name
            end
            self.values = self.values.map do |pivots, value|
              pivots = pivots[0..-2] if pivots.last == ""
              [pivots, value]
            end.to_h
            self.values = Reports::Utils.correct_aggregate_counts(self.values)
          end
        end
      end

      pivots.each do |pivot|
        if /(^age$|^age_.*|.*_age$|.*_age_.*)/.match(pivot) && field_map[pivot].present? && field_map[pivot]['type'] == 'numeric_field'
          age_field_index = pivot_index(pivot)
          if group_ages && age_field_index && age_field_index < dimensionality
            self.values = Reports::Utils.group_values(self.values, age_field_index) do |pivot_name|
              age_ranges.find{|range| range.cover? pivot_name}
            end
          end
        end
      end

      if group_dates_by.present?
        date_fields = pivot_fields.select{|_, f| f.type == Field::DATE_FIELD}
        date_fields.each do |field_name, _|
          if pivot_index(field_name) < dimensionality
            self.values = Reports::Utils.group_values(self.values, pivot_index(field_name)) do |pivot_name|
              Reports::Utils.date_range(pivot_name, group_dates_by)
            end
          end
        end
      end

      aggregate_limit = aggregate_by.size
      aggregate_limit = dimensionality if aggregate_limit > dimensionality

      aggregate_value_range = self.values.keys.map do |pivot|
        pivot[0..(aggregate_limit-1)]
      end.uniq.compact.sort(&method(:pivot_comparator))

      disaggregate_value_range = self.values.keys.map do |pivot|
        pivot[(aggregate_limit)..-1]
      end.uniq.compact.sort(&method(:pivot_comparator))

      self.data = {
        #total: response['response']['numFound'], #TODO: Do we need the total?
        aggregate_value_range: aggregate_value_range,
        disaggregate_value_range: disaggregate_value_range,
        values: @values
      }
      ""
    end
  end

  #TODO: Do we need the total?
  # def total
  #   self.data[:total]
  # end

  def modules_present
    if self.module_id.present? && self.module_id.length >= 1
      return I18n.t("errors.models.report.module_syntax") if module_id.split('-').first != 'primeromodule'
      return true
    end
    return I18n.t("errors.models.report.module_presence")
  end

  def has_data?
    self.data[:values].present?
  end

  def aggregate_value_range
    self.data[:aggregate_value_range]
  end

  def disaggregate_value_range
    self.data[:disaggregate_value_range]
  end

  def values
    #A little contorted to allow report data saving in the future
    if @values.present?
      @values
    elsif  self.data.present?
      self.data[:values]
    else
      {}
    end
  end

  def values=(values)
    @values = values
  end


  def dimensionality
    if values.present?
      d = values.first.first.size
    else
      d = (self.aggregate_by + self.disaggregate_by).size
      d += 1 if aggregate_counts_from.present?
    end
    return d
  end

  # Recursively read through the Solr pivot output and construct a vector of results.
  # The output is an array of arrays (easily convertible into a hash) of the following format:
  # [
  #   [[x0, y0, z0, ...], pivot_count0],
  #   [[x1, y1, z1, ...], pivot_count1],
  #   ...
  # ]
  # where each key is an array of the pivot nest tree, and the value is the aggregate pivot count.
  # So if the Solr pivot query is location, pivoted by protection concern, by age, and by sex,
  # the key array will be:
  #   [[a location, a protection concern, an age, a sex], count of records matching this criteria]
  # Solr returns partial pivot counts. In those cases, the unknown pivot key will be an empty string.
  #   [["Somalia", "CAAFAG", "", ""], count]
  # returns the count of all ages and sexes that are CAFAAG in Somalia
  def value_vector(parent_key, pivots)
    current_key = parent_key + [pivots['value']]
    current_key = [] if current_key == [nil]
    #if !pivots.key? 'pivot'
    if !pivots['pivot'].present?
      return [[current_key, pivots['count']]]
    else
      vectors = []
      pivots['pivot'].each do |child|
        vectors += value_vector(current_key, child)
      end
      max_key_length = vectors.first.first.size
      this_key = current_key + ([""] * (max_key_length - current_key.length))
      vectors = vectors + [[this_key, pivots['count']]]
      return vectors
    end
  end

  def self.reportable_record_types
    FormSection::RECORD_TYPES + ['violation'] + Report.get_all_nested_reportable_types.map{|nrt| nrt.name.underscore}
  end

  def apply_default_filters
    if self.add_default_filters
      self.filters ||= []
      default_filters = Record.model_from_name(self.record_type).report_filters
      self.filters = (self.filters + default_filters).uniq
    end
  end

  def pivots
    (self.aggregate_by || []) + (self.disaggregate_by || [])
  end

  def pivot_fields
    @pivot_fields ||= Field.find_by_name(pivots)
      .group_by{|f| f.name}
      .map{|k,v| [k, v.first]}
      .to_h
  end

  def pivot_index(field_name)
    pivots.index(field_name)
  end

  def pivot_comparator(a,b)
    (a <=> b) || (a.to_s <=> b.to_s)
  end

  private

  def report_values(record_type, pivots, filters)
    result = {}
    pivots = pivots + [self.aggregate_counts_from] if self.aggregate_counts_from.present?
    pivots_data = query_solr(record_type, pivots, filters)
    #TODO: The format needs to change and we should probably store data? Although the report seems pretty fast for 100...
    if pivots_data['pivot'].present?
      result = self.value_vector([],pivots_data).to_h
    end
    return result
  end


  #TODO: This method should really be replaced by a Sunspot query
  def query_solr(record_type, pivots, filters)
    #TODO: This has to be valid and open if a case.
    number_of_pivots = pivots.size #can also be dimensionality, but the goal is to move the solr methods out
    pivots_string = pivots.map{|p| SolrUtils.indexed_field_name(record_type, p)}.select(&:present?).join(',')
    filter_query = build_solr_filter_query(record_type, filters)
    result_pivots = []
    if number_of_pivots == 1
      params = {
        :q => filter_query,
        :rows => 0,
        :facet => 'on',
        :'facet.field' => pivots_string,
        :'facet.mincount' => -1,
        :'facet.limit' => -1,
      }
      response = SolrUtils.sunspot_rsolr.get('select', params: params)
      is_numeric = pivots_string.end_with? '_i' #TODO: A bit of a hack to assume that numeric Solr fields will always end with "_i"
      response['facet_counts']['facet_fields'][pivots_string].each do |v|
        if v.class == String
          result_pivots << (is_numeric ? {'value' => v.to_i} : {'value' => v})
        else
          result_pivots.last['count'] = v
        end
      end
    else
      params = {
        :q => filter_query,
        :rows => 0,
        :facet => 'on',
        :'facet.pivot' => pivots_string,
        :'facet.pivot.mincount' => -1,
        :'facet.limit' => -1,
      }
      response = SolrUtils.sunspot_rsolr.get('select', params: params)
      result_pivots = response['facet_counts']['facet_pivot'][pivots_string]
    end

    result = {'pivot' => result_pivots}
  end

  def build_solr_filter_query(record_type, filters)

    filters_query = "type:#{solr_record_type(record_type)}"
    if filters.present?
      filters_query = filters_query + ' ' + filters.map do |filter|
        attribute = SolrUtils.indexed_field_name(record_type, filter['attribute'])
        constraint = filter['constraint']
        value = filter['value']
        query = nil
        if attribute.present? && value.present?
          if constraint.present?
            value = Date.parse(value).strftime("%FT%H:%M:%SZ") unless value.is_number?
            query = if constraint == '>'
              "#{attribute}:[#{value} TO *]"
            elsif constraint == '<'
              "#{attribute}:[* TO #{value}]"
            else
              "#{attribute}:\"#{value}\""
            end
          else
            query = if value.respond_to?(:map) && value.size > 0
              '(' + value.map{|v|
                if v == "not_null"
                  "#{attribute}:[* TO *]"
                else
                  "#{attribute}:\"#{v}\""
                end
              }.join(" OR ") + ')'
            end
          end
        elsif attribute.present? && constraint.present? && constraint == 'not_null'
          "#{attribute}:[* TO *]"
        end
      end.compact.join(" ")
    end
    return filters_query
  end

  def solr_record_type(record_type)
    record_type = 'child' if record_type == 'case'
    record_type.camelize
  end

end
