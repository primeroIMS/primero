class Report < CouchRest::Model::Base
  use_database :report
  include PrimeroModel
  include BelongsToModule

  REPORTABLE_FIELD_TYPES = [
    #Field::TEXT_FIELD,
    #Field::TEXT_AREA,
    Field::RADIO_BUTTON,
    Field::SELECT_BOX,
    Field::CHECK_BOXES,
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

  AGE_FIELD = 'age' #TODO: should this be made generic?

  DAY = 'date' #eg. 13-Jan-2015
  WEEK = 'week' #eg. Week 2 Jan-2015
  MONTH = 'month' #eg. Jan-2015
  YEAR = 'year' #eg. 2015
  QUARTER = 'quarter'
  DATE_RANGES = [DAY, WEEK, MONTH, QUARTER, YEAR]

  property :name
  property :description
  property :module_ids, [String]
  property :record_type #case, incident, etc.
  property :aggregate_by, [String], default: [] #Y-axis
  property :disaggregate_by, [String], default: [] #X-axis
  property :aggregate_counts_from
  property :filters
  property :group_ages, TrueClass, default: false
  property :group_dates_by, default: DAY
  property :is_graph, TrueClass, default: false
  property :editable, TrueClass, default: true
  property :ui_filters

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

  validates_presence_of :name
  validates_presence_of :record_type
  validates_presence_of :aggregate_by
  validate do |report|
    report.validate_modules_present(:module_ids)
  end

  before_save :apply_default_filters

  design do
    view :by_name
    view :by_module_id,
      :map => "function(doc) {
                if (doc['couchrest-type'] == 'Report' && doc['module_ids']){
                  for(var i in doc['module_ids']){
                    emit(doc['module_ids'][i], doc['_id']);
                  }
                }
              }"
  end

  def self.create_or_update(report_hash)
    report_id = report_hash[:id]
    report = Report.get(report_id)
    if report.nil?
      Report.create! report_hash
    else
      report.update_attributes report_hash
    end
  end

  def self.get_reportable_subform_record_field_name(model, record_type)
    model = Record::model_from_name(model)
    if model.try(:nested_reportable_types)
      return model.nested_reportable_types.select{|nrt| nrt.model_name.param_key == record_type}.first.try(:record_field_name)
    end
  end

  def self.get_reportable_subform_record_field_names(model)
    model = Record::model_from_name(model)
    if model.try(:nested_reportable_types)
      return model.nested_reportable_types.map{|nrt| nrt.model_name.param_key}
    end
  end

  def self.record_type_is_nested_reportable_subform?(model, record_type)
    get_reportable_subform_record_field_names(model).include?(record_type)
  end

  def self.get_all_nested_reportable_types
    record_types = []
    FormSection::RECORD_TYPES.each do |rt|
      record_types = record_types + Record.model_from_name(rt).try(:nested_reportable_types)
    end
    record_types
  end

  def modules
    @modules ||= PrimeroModule.all(keys: self.module_ids).all if self.module_ids.present?
  end

  # Run the Solr query that calculates the pivots and format the output.
  #TODO: Break up into self contained, testable methods
  def build_report
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
      age_field_index = pivot_index(AGE_FIELD)
      if group_ages && age_field_index && age_field_index < dimensionality
        sys = SystemSettings.current
        primary_range = sys.primary_age_range
        age_ranges = sys.age_ranges[primary_range]

        self.values = Reports::Utils.group_values(self.values, age_field_index) do |pivot_name|
          age_ranges.find{|range| range.cover? pivot_name}
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

      if is_graph
        graph_value_range = self.values.keys.map{|k| k[0..1]}.uniq.compact.sort(&method(:pivot_comparator))
        #Discard all aggegates that are a lower dimensionality thatn the graph
        graph_value_range = graph_value_range.select{|v| v.last.present?}
      end

      self.data = {
        #total: response['response']['numFound'], #TODO: Do we need the total?
        aggregate_value_range: aggregate_value_range,
        disaggregate_value_range: disaggregate_value_range,
        values: @values
      }
      self.data[:graph_value_range] = graph_value_range if is_graph
      self.data = self.translate_data(self.data)
      ""
    end
  end

  def parse_filter_dates(type, dates)
    dates = dates.split('.')
    parsed_dates = []

    case type
    when 'month'
      parsed_dates << format_date(dates.first, :beginning_of_month) << format_date(dates.last, :end_of_month)
    when 'year'
      parsed_dates << format_date(DateTime.new(dates.first.to_i), :beginning_of_year) << format_date(DateTime.new(dates.last.to_i), :end_of_year)
    when 'week'
      parsed_dates << format_date(dates.first, :beginning_of_week) << format_date(dates.last, :end_of_week)
    when 'quarter'
      parsed_dates << format_date(dates.first, :beginning_of_quarter, true) << format_date(dates.first, :end_of_quarter, true)
    else
      parsed_dates << format_date(dates.first) << format_date(dates.last)
    end

    if parsed_dates.count == 2
      return ['[' + parsed_dates.first + ' TO ' + parsed_dates.last  + ']']
    else
      return parsed_dates.first
    end
  end

  def build_data_filters(scope)
    filters = []

    if scope.present?
      scope.each do |k, v|
        ui_filter = self.ui_filters.find {|ui| ui['name'] == k }
        value = v.split('||')
        value = v.include?(' - ')? ['['+ v.gsub('-','TO')+']'] : v.split('||')

        if ui_filter['location_filter']
          locations = []

          value.each do |location|
            placenames = location.split('::')
            location_and_descendants = Location.find_by_location(placenames.last)
            locations << location_and_descendants.map(&:name) if location_and_descendants.present?
          end

          value = locations.flatten
        end

        value = parse_filter_dates(value.first, value.last) if ui_filter['type'] == 'date'
        self.filters.reject!{ |s| s['attribute'] == k }
        filters << { 'attribute' => k , 'value' => value }
      end
    end

    self.filters + filters
  end

  #TODO: Do we need the total?
  # def total
  #   self.data[:total]
  # end

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

  #TODO: This method currently builds data for 1D and 2D reports
  def graph_data
    labels = []
    chart_datasets_hash = {}
    number_of_blanks = dimensionality - self.data[:graph_value_range].first.size
    self.data[:graph_value_range].each do |key|
      #The key to the global report data
      data_key = key + [""] * number_of_blanks
      #The label (as understood by chart.js), is always the first dimension value
      label = key[0].to_s
      labels << label if label != labels.last
      #The key to the
      chart_datasets_key = (key.size > 1) ? key[1].to_s : ""
      if chart_datasets_hash.key? chart_datasets_key
        chart_datasets_hash[chart_datasets_key] << self.values[data_key]
      else
        chart_datasets_hash[chart_datasets_key] = [self.values[data_key]]
      end
    end

    datasets = []
    chart_datasets_hash.keys.each do |key|
      datasets << {
        label: key,
        title: key,
        data: chart_datasets_hash[key]
      }
    end

    aggregate_field = Field.find_by_name(aggregate_by.first)
    aggregate = aggregate_field ? aggregate_field.display_name : aggregate_by.first.humanize

    #We are discarding the totals TODO: will that work for a 1X?
    return {aggregate: aggregate, labels: labels, datasets: datasets}
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
    FormSection::RECORD_TYPES + ['violation'] + Report.get_all_nested_reportable_types.map{|nrt| nrt.model_name.param_key}
  end

  def apply_default_filters
    if self.add_default_filters
      self.filters ||= []
      default_filters = Record.model_from_name(self.record_type).report_filters
      self.filters = (self.filters + default_filters).uniq
    end
  end

  def translate_data(data)
    #TODO: Eventually we want all i18n to be applied through this method
    [:aggregate_value_range, :disaggregate_value_range, :graph_value_range].each do |k|
      if data[k].present?
        data[k] = data[k].map do |value|
          value.map{|v| translate(v)}
        end
      end
    end
    if data[:values].present?
      data[:values] = data[:values].map do |key,value|
        [key.map{|k| translate(k)}, value]
      end.to_h
    end
    return data
  end

  #TODO: When we have true I18n we will discard this method and just use I18n.t()
  def translate(string)
    ['false', 'true'].include?(string) ? I18n.t(string) : string
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
    pivots_string = pivots.map{|p| SolrUtils.indexed_field_name(record_type, p)}.join(',')
    filter_query = build_solr_filter_query(record_type, filters)
    if number_of_pivots == 1
      params = {
        :q => filter_query,
        :rows => 0,
        :facet => 'on',
        :'facet.field' => pivots_string,
        :'facet.mincount' => 1,
        :'facet.limit' => -1,
      }
      response = SolrUtils.sunspot_rsolr.get('select', params: params)
      pivots = []
      is_numeric = pivots_string.end_with? '_i' #TODO: A bit of a hack to assume that numeric Solr fields will always end with "_i"
      response['facet_counts']['facet_fields'][pivots_string].each do |v|
        if v.class == String
          v = v.to_i if is_numeric
          pivots << {'value' => v}
        else
          pivots.last['count'] = v
        end
      end
      result = {'pivot' => pivots}
    else
      params = {
        :q => filter_query,
        :rows => 0,
        :facet => 'on',
        :'facet.pivot' => pivots_string,
        :'facet.pivot.mincount' => 1,
        :'facet.limit' => -1,
      }
      response = SolrUtils.sunspot_rsolr.get('select', params: params)
      result = {'pivot' => response['facet_counts']['facet_pivot'][pivots_string]}
    end
    return result
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
            value = Date.parse(value).xmlschema unless value.is_number?
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
                elsif v.match(/^\[.*\]$/)
                  "#{attribute}:#{v}"
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

  def format_date(date, calculation=nil, is_quarter=false)
    parsed_date =
      if date.is_a?(DateTime)
        date
      elsif date.is_a?(String) && is_quarter
        if calculation == :beginning_of_quarter
          DateTime.new(Date.today.year, date.to_i * 3 - 2)
        else
          DateTime.new(Date.today.year, date.to_i * 3 - 2)
        end
      else
        DateTime.parse(date)
      end

    if calculation.present?
      parsed_date = parsed_date.send(calculation)
    end

    parsed_date.strftime("%Y-%m-%dT%H:%M:%SZ")
  end
end
