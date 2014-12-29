class Report < CouchRest::Model::Base
  use_database :report
  include PrimeroModel
  include BelongsToModule

  property :name
  property :description
  property :module_ids, [String]
  property :record_type #case, incident, etc.
  property :aggregate_by, [String], default: [] #Y-axis
  property :disaggregate_by, [String], default: [] #X-axis
  property :filters
  property :is_graph, TrueClass, default: false
  property :editable, TrueClass, default: true
  #TODO: Currently it's not worth trying to save off the report data.
  #      The report builds a value hash with an array of strings as keys. CouchDB/CouchRest converts this array to a string.
  #      Not clear what benefit could be gained by storing the data but converting keys to strings on the fly
  #      when rendering the graph and table. So for now we will rebuild the data.
  #property :data
  attr_accessor :data

  validates_presence_of :name
  validates_presence_of :record_type
  validates_presence_of :aggregate_by
  validate do |report|
   report.validate_modules_present(:module_ids)
  end

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

  def record_class
    @record_class ||= eval record_type.camelize if record_type.present?
  end

  def modules
    @modules ||= PrimeroModule.all(keys: self.module_ids).all if self.module_ids.present?
  end

  # Run the Solr query that calculates the pivots and format the output.
  def build_report
    pivots = (aggregate_by + disaggregate_by)
    number_of_pivots = pivots.size
    if pivots.present?
      pivots = pivots.map{|p| SolrUtils.indexed_field_name(self.record_type, p)}.join(',')
      pivots_data = query_solr(pivots, number_of_pivots, filters)
      #TODO: The format needs to change and we should probably store data? Although the report seems pretty fast for 100...
      if pivots_data['pivot'].present?
        values = self.value_vector([],pivots_data).to_h
      else
        values = {}
      end
      aggregate_value_range = values.keys.map{|k| k[0..(aggregate_by.size-1)]}.uniq.sort{|a,b| (a<=>b).nil? ? a.to_s <=> b.to_s : a <=> b}
      disaggregate_value_range = values.keys.map{|k| k[(aggregate_by.size)..-1]}.uniq.sort{|a,b| (a<=>b).nil? ? a.to_s <=> b.to_s : a <=> b}
      if is_graph
        graph_value_range = values.keys.map{|k| k[0..1]}.uniq.sort{|a,b| (a<=>b).nil? ? a.to_s <=> b.to_s : a <=> b}
        #Discard all aggegates that are a lower dimensionality thatn the graph
        graph_value_range = graph_value_range.select{|v| v.last.present?}
      end

      self.data = {
        #total: response['response']['numFound'], #TODO: Do we need the total?
        aggregate_value_range: aggregate_value_range,
        disaggregate_value_range: disaggregate_value_range,
        graph_value_range: graph_value_range,
        values: values
      }
      self.data[:graph_value_range] = graph_value_range if is_graph
      ""
    end
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
    self.data[:values]
  end

  def dimensionality
    (self.aggregate_by + self.disaggregate_by).size
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
      labels << key[0] if key[0] != labels.last
      #The key to the
      chart_datasets_key = (key.size > 1) ? key[1] : ""
      if chart_datasets_hash.key? chart_datasets_key
        chart_datasets_hash[chart_datasets_key] << self.values[data_key]
      else
        chart_datasets_hash[chart_datasets_key] = [self.values[data_key]]
      end
    end

    datasets = []
    chart_datasets_hash.keys.each do |key|
      datasets << {label: key, data: chart_datasets_hash[key]}
    end

    #We are discarding the totals TODO: will that work for a 1X?
    return {labels: labels, datasets: datasets}
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
    if !pivots.key? 'pivot'
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
    #Field::TALLY_FIELD,
  ]

  # Fetch and group all reportable fields by form given a user.
  # This will be used by the field lookup.
  def self.all_reportable_fields_by_form(primero_modules, record_type, user)
    reportable = {}
    if primero_modules.present?
      primero_modules.each do |primero_module|
        forms = FormSection.get_permitted_form_sections(primero_module, record_type, user)
        #Hide away the subforms (but not the invisible forms!)
        forms = forms.select{|f| !f.is_nested?}
        forms = forms.sort_by{|f| [f.order_form_group, f.order]}
        #TODO: Maybe move this logic to controller?
        forms = forms.map do |form|
          fields = form.fields.select{|f| REPORTABLE_FIELD_TYPES.include? f.type}
          fields = fields.map{|f| [f.name, f.display_name, f.type]}
          [form.name, fields]
        end
        reportable[primero_module.name] = forms
      end
    end
    return reportable
  end


  private

  #TODO: This method should really be replaced by a Sunspot query
  def query_solr(pivots_string, number_of_pivots, filters)
    #TODO: This has to be valid and open if a case.
    filter_query = build_solr_filter_query(filters)
    if number_of_pivots == 1
      params = {
        :q => filter_query,
        :rows => 0,
        :facet => 'on',
        :'facet.field' => pivots_string,
        :'facet.mincount' => -1,
      }
      response = SolrUtils.sunspot_rsolr.get('select', params: params)
      pivots = []
      response['facet_counts']['facet_fields'][pivots_string].each do |v|
        if v.class == String
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
        :'facet.pivot.mincount' => -1,
      }
      response = SolrUtils.sunspot_rsolr.get('select', params: params)
      result = {'pivot' => response['facet_counts']['facet_pivot'][pivots_string]}
    end
    return result
  end


  #TODO: This only works for string value filters. Add at least dates?
  def build_solr_filter_query(filters)
    filters_query = '*:*'
    if filters.present?
      filters_query = filters.map do |filter|
        attribute = SolrUtils.indexed_field_name(self.record_type, filter['attribute'])
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
              "#{attribute}:#{value}"
            end
          else
            query = if value.respond_to?(:map) && value.size > 1
              '(' + value.map{|v| "#{attribute}:#{v}"}.join(" OR ") + ')'
            else
              "#{attribute}:#{value}"
            end
          end
        end
      end.compact.join(" ")
    end
    return filters_query
  end

end
