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
      self.data = {
        total: response['response']['numFound'],
        pivots: response['facet_counts']['facet_pivot'][pivots]
      }
    end


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


end
