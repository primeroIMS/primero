def create_or_update_report(report_hash)
  report_id = report_hash[:id]
  report = Report.get(report_id)

  if report.nil?
    puts "Creating report #{report_hash[:name]}"
    Report.create! report_hash
  else
    puts "Updating agency #{report_hash[:name]}"
    report.update_attributes report_hash
  end
end

#To generate the UUID, run the following in the rails consle:
#    UUIDTools::UUID.random_create.to_s.gsub('-','')

default_case_filters = [
  {'attribute' => 'child_status', 'value' => ['open']},
  {'attribute' => 'record_state', 'value' => ['true']}
]

create_or_update_report({
  id: '9fed7861bef14ec9ab51b41d6555319a',
  name: 'Registration',
  description: 'Case registrations over time',
  module_ids: [PrimeroModule::CP, PrimeroModule::GBV],
  record_type: 'case',
  aggregate_by: ['registration_date'],
  filters: default_case_filters,
  is_graph: true,
  editable: false
})

#TODO: This doesn't account for referrals
create_or_update_report({
  id: 'c48322c93cda42f684de9e5812b4869f',
  name: 'Caseload Summary',
  description: 'Number of cases for each case worker',
  module_ids: [PrimeroModule::CP, PrimeroModule::GBV],
  record_type: 'case',
  aggregate_by: ['owned_by'],
  filters: default_case_filters,
  is_graph: true,
  editable: false
})

#TODO: We need to index agaency of current record owner. What abut referrals?
# create_or_update_report({
#   id: '957ade8094074ebd8b9a94baaa07d1ab',
#   name: 'Cases by Agency',
#   description: 'Number of cases broken down by agency',
#   module_ids: ['CP', 'GBV'],
#   record_type: 'case',
#   aggregate_by: ['owned_by'],
#   filters: default_case_filters,
#   is_graph: true,
#   editable: false
# })

create_or_update_report({
  id: '1b00e72e20d5419083b9ef06fd4c2705',
  name: 'Cases by Nationality',
  description: 'Number of cases broken down by nationality',
  module_ids: [PrimeroModule::CP],
  record_type: 'case',
  aggregate_by: ['nationality'],
  filters: default_case_filters,
  is_graph: true,
  editable: false
})

create_or_update_report({
  id: '4102c67d9c964cd6b3d27eea6cad8b1f',
  name: 'Cases by Age and Sex',
  description: 'Number of cases broken down by age and sex',
  module_ids: [PrimeroModule::CP],
  record_type: 'case',
  aggregate_by: ['age'],
  disaggregate_by: ['sex'],
  filters: default_case_filters,
  is_graph: true,
  editable: false
})

create_or_update_report({
  id: '2336b8190963441587fc3d84351fb043',
  name: 'Cases by Protection Concern',
  description: 'Number of cases broken down by protection concern and sex',
  module_ids: [PrimeroModule::CP],
  record_type: 'case',
  aggregate_by: ['protection_concerns'],
  disaggregate_by: ['sex'],
  filters: default_case_filters,
  is_graph: true,
  editable: false
})

create_or_update_report({
  id: 'fdd89b21d49c44489e4ce147c62ae3fb',
  name: 'Current Care Arrangements',
  description: 'The care arrangements broken down by age and sex',
  module_ids: [PrimeroModule::CP],
  record_type: 'case',
  aggregate_by: ['care_arrangements_type'],
  disaggregate_by: ['sex', 'age'],
  filters: default_case_filters,
  is_graph: true,
  editable: false
})
