class ReportableFollowUp

  def self.parent_record_type
    Child
  end

  def self.record_field_name
    'followup_subform_section'
  end

  def self.report_filters
    [
      {'attribute' => 'status', 'value' => [Record::STATUS_OPEN]},
      {'attribute' => 'record_state', 'value' => ['true']},
      {'attribute' => 'followup_date', 'constraint' => 'not_null'}
    ]
  end


  include ReportableNestedRecord

  searchable auto_index: self.auto_index? do
    extend ReportableNestedRecord::Searchable
    configure_searchable(ReportableFollowUp)
  end

  def id
    object_value('unique_id')
  end

end