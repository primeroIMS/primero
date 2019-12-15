class ReportableService

  def self.parent_record_type
    Child
  end

  def self.record_field_name
    'services_section'
  end

  def self.report_filters
    [
      {'attribute' => 'status', 'value' => [Record::STATUS_OPEN]},
      {'attribute' => 'record_state', 'value' => ['true']},
      {'attribute' => 'service_type', 'value' => 'not_null'},
      {'attribute' => 'service_appointment_date', 'constraint' => 'not_null'}
    ]
  end


  include ReportableNestedRecord

  searchable do
    extend ReportableNestedRecord::Searchable
    configure_searchable(ReportableService)

    time :service_due_date
  end

  def service_due_date
    @service_due_date ||= @parent_record.service_due_date(@object)
  end

  def service_implemented?
    implemented = object_value("service_implemented")
    implemented.present? && implemented == "implemented"
  end

  def id
    object_value('unique_id')
  end

end