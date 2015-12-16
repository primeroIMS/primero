class ReportableProtectionConcern

  def self.parent_record_type
    Child
  end

  def self.record_field_name
    'protection_concern_detail_subform_section'
  end

  def self.not_null_field
    'protection_concern_type'
  end


  include ReportableNestedRecord

  searchable do
    extend ReportableNestedRecord::Searchable
    configure_searchable(ReportableProtectionConcern)
  end

  def id
    object_value('unique_id')
  end

end