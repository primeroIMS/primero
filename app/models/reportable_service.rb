class ReportableService

  def self.parent_record_type
    Child
  end

  def self.record_field_name
    'services_section'
  end

  def self.report_filters
    [
      {'attribute' => 'child_status', 'value' => [Record::STATUS_OPEN]},
      {'attribute' => 'record_state', 'value' => ['true']},
      {'attribute' => 'service_type', 'value' => 'not_null'},
      {'attribute' => 'service_appointment_date', 'constraint' => 'not_null'}
    ]
  end


  include ReportableNestedRecord

  searchable do
    extend ReportableNestedRecord::Searchable
    configure_searchable(ReportableService)

    string :service_case_workflow, :stored => true do
      self.parent_record.workflow
    end

    string :service_case_risk_level, :stored => true do
      self.parent_record.workflow
    end
  end

  def id
    object_value('unique_id')
  end

end