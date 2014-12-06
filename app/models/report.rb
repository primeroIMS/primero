class Report < CouchRest::Model::Base
  use_database :report
  include PrimeroModel

  property :name
  property :description
  property :module_ids, [String]
  property :record_type #case, incident, etc.
  property :aggregate_by, [String], default: [] #Y-axis
  property :disaggregate_by, [String], default: [] #X-axis
  property :is_graph, TrueClass, default: false
  property :editable, TrueClass, default: true
  #property :data

  attr_accessor :data

  validates_presence_of :name
  validates_presence_of :record_type
  validates_presence_of :aggregate_by

  design do
    view :by_name
  end

  def record_class
    @record_class ||= eval record_type.camelize if record_type.present?
  end

  # Run the Solr query that calculates the pivots and format the output.
  def build_report
    pivots = (aggregate_by + disaggregate_by)
    number_of_pivots = pivots.size
    if pivots.present?
      pivots = pivots.map{|p| SolrUtils.indexed_field_name(self.record_type, p)}.join(',')
      #TODO: This has to be valid and open if a case
      pivots_data = query_solr(pivots, number_of_pivots)
      #TODO: The format needs to change and we should probably store data? Although the report seems pretty fast for 100...

      values = self.value_vector([],pivots_data).to_h
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

  private

  def query_solr(pivots_string, number_of_pivots)
     #TODO: This has to be valid and open if a case
    if number_of_pivots == 1
      params = {
        :q => '*:*',
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
        :q => '*:*',
        :rows => 0,
        :facet => 'on',
        :'facet.pivot' => pivots_string,
        :'facet.pivot.mincount' => -1,
      }
      #TODO: Deal with this: "facet_fields"=>{"nationality_sm"=>["Tanzania", 16, "South Sudan", 14, "Ethiopia", 13, "Rwanda", 12, "Uganda", 12, "Burundi", 11, "Somalia", 11, "Kenya", 10, "Cameroon", 1]},
      response = SolrUtils.sunspot_rsolr.get('select', params: params)
      result = {'pivot' => response['facet_counts']['facet_pivot'][pivots_string]}
    end
    return result
  end



end
