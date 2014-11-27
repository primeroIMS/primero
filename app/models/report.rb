class Report < CouchRest::Model::Base
  use_database :report
  include PrimeroModel

  property :name
  property :description
  property :module_id
  property :record_type #case, incident, etc.
  property :aggregate_by, [String] #Y-axis
  property :disaggregate_by, [String] #X-axis
  property :is_graph, TrueClass
  #property :data

  attr_accessor :data

  design do
    view :by_name
  end

  def record_class
    @record_class ||= eval record_type.camelize if record_type.present?
  end

  def build_report
    pivots = (aggregate_by + disaggregate_by)
    if pivots.present?
      pivots = pivots.map{|p| self.indexed_field_name(p)}.join(',')
      response = rsolr.get(
        'select',
        :params => {
          :q => '*:*',
          :rows => 0,
          :facet => 'on',
          :'facet.pivot' => pivots,
          :'facet.pivot.mincount' => -1,
        }
      )
      #TODO: The format needs to change and we should probably store data? Although the report seems pretty fast for 100...

      pivots_data = response['facet_counts']['facet_pivot'][pivots]

      aggregate_value_range = {}
      disaggregate_value_range = {}
      pivots_drilldown = pivots_data

      aggregate_by.each do |aggregate|
        aggregate_value_range[aggregate] = pivots_drilldown.map{|d| d['value']}.sort
        pivots_drilldown = pivots_drilldown.first['pivot']
      end

      if disaggregate_by.present?
        disaggregate_by.each do |disaggregate|
          disaggregate_value_range[disaggregate] = pivots_drilldown.map{|d| d['value']}.sort
          pivots_drilldown = pivots_drilldown.first['pivot']
        end
      end

      self.data = {
        total: response['response']['numFound'],
        pivots: pivots_data,
        aggregate_value_range: aggregate_value_range,
        disaggregate_value_range: disaggregate_value_range
      }
    end
  end


  def disaggregate_values
    expand_values(self.disaggregate_by, self.data[:disaggregate_value_range])
  end

  def aggregate_values
    expand_values(self.aggregate_by, self.data[:aggregate_value_range])
  end


  #TODO: Any connection tests?
  def rsolr
    @rsolr ||= Sunspot.session.session.rsolr_connection
  end

  #TODO: This doesn't really belong here and should be accessible by other things
  def sunspot_setup
    type = self.record_type == 'case' ? 'Child' : self.record_type.camel_case
    @setup ||= Sunspot::Setup.for(eval(type))
  end

  #TODO: Neither does this.
  def indexed_field_name(name)
    field = sunspot_setup.field(name)
    field.indexed_name
  end

  #private

  def expand_values(keys, value_range_hash)
    if keys.size == 1
      return value_range_hash[keys.first]
    else
      nest = expand_values(keys[1..-1], value_range_hash)
      return value_range_hash[keys.first].map{|v| [v] + nest}.flatten
    end
  end

  def key_vector(keys, value_range_hash)
    value_ranges = keys.reverse.map{|k| value_range_hash[k] + [nil]}
    value_ranges.reduce{|r,v| v.product(r)}.map(&:flatten)
  end

  def key_matrix_2d
    aggregate_vector = key_vector(self.aggregate_by, self.data[:aggregate_value_range])
    disaggregate_vector = key_vector(self.disaggregate_by, self.data[:disaggregate_value_range])

    matrix = []
    aggregate_vector.each do |agg|
      row = []
      disaggregate_vector.each do |dis|
        row << agg + dis
      end
      matrix << row
    end

    return matrix
  end

  def value_vector(parent_key, pivots)
    current_key = parent_key + [pivots['value']]
    current_key = [] if current_key == [nil]
    if !pivots.key? 'pivot'
      return [{current_key => pivots['count']}]
    else
      vectors = []
      pivots['pivot'].each do |child|
        vectors += value_vector(current_key, child)
      end
      max_key_length = vectors.first.keys.first.size
      this_key = current_key + ([nil] * (max_key_length - current_key.length))
      vectors + [{this_key => pivots['count']}]
      return vectors
    end
  end

  def value_matrix
    matrix = {}
    self.value_vector([],{'pivot' => self.data[:pivots]}).each do |v|
      matrix = matrix.merge(v)
    end
    return matrix
  end




end
