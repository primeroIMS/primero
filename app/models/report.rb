class Report < CouchRest::Model::Base
  use_database :report
  include PrimeroModel

  property :name
  property :description
  property :module_id
  property :record_type #case, incident, etc.
  property :rows, [String]
  property :columns, [String]
  property :is_graph, TrueClass

  attr_accessor :data

  design do
    view :by_name
  end

  def record_class
    @record_class ||= eval record_type.camelize if record_type.present?
  end

  def build_report

  end


end
