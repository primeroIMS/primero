# #To generate the UUID, run the following in the rails consle:
# #    UUIDTools::UUID.random_create.to_s.gsub('-','')

default_filters = [
  {'attribute' => 'status', 'value' => ['Open']},
  {'attribute' => 'record_state', 'value' => ['true']}
]

Report.create_or_update({
  id: '8903db85c4c048f4cef0168cbdbe1f48',
  name: 'Killing of Children',
  description: 'Killing of Children by CTFMR verification status',
  module_ids: [PrimeroModule::MRM],
  record_type: 'violation',
  aggregate_by: ['ctfmr_verified'],
  aggregate_counts_from: 'violation_tally',
  filters: default_filters + [
    {'attribute' => 'category', 'value' => ['killing']}
  ],
  is_graph: false,
  editable: false
})

# #TODO: do we need to filter for verified?
# default_filters = [
#   {'attribute' => 'status', 'value' => ['Open']},
#   {'attribute' => 'record_state', 'value' => ['true']}
# ]


# Report.create_or_update({
#   id: 'fd62097e40e345d59d107b9c07758353',
#   name: 'Children affected by MRM violations by country',
#   description: 'Violation totals by country',
#   module_ids: [PrimeroModule::MRM],
#   record_type: 'violation',
#   aggregate_by: ['incident_location', 'category'],
#   aggregate_counts_from: 'violation_tally',
#   filters: default_filters, #TODO: do we need to filter for verified?
#   is_graph: true,
#   editable: false
# })

# Report.create_or_update({
#   id: '0cf3ca40fa334ae697ba5066cd25d7ca',
#   name: 'Violations by country by cause ',
#   description: 'Breakdown of all killings and maimings by country by cause',
#   module_ids: [PrimeroModule::MRM],
#   record_type: 'violation',
#   aggregate_by: ['incident_location', 'cause'],
#   filters: default_filters + [
#     {'attribute' => 'category', 'value' => ['killing', 'maiming']}
#   ],
#   is_graph: true,
#   editable: false
# })

# Report.create_or_update({
#   id: 'a897ddcdbb72490cbbac2e5313ece3ef',
#   name: 'Cause of Killing or Maiming',
#   description: 'Children affected by killings and maimings broken down by cause',
#   module_ids: [PrimeroModule::MRM],
#   record_type: 'violation',
#   aggregate_by: ['cause'],
#   aggregate_counts_from: 'violation_tally',
#   filters: default_filters + [
#     {'attribute' => 'category', 'value' => ['killing', 'maiming']}
#   ],
#   is_graph: true,
#   editable: false
# })

# Report.create_or_update({
#   id: 'ccb4c0e8104c4e2992e2fdd686fdfcc5',
#   name: 'Verification Status',
#   description: 'Violations by verification status',
#   module_ids: [PrimeroModule::MRM],
#   record_type: 'violation',
#   aggregate_by: ['verified'],
#   filters: default_filters,
#   is_graph: true,
#   editable: false
# })

# #TODO: Attacks on Protection Personnel
# Report.create_or_update({
#   id: '6c5955e85cfa4e02af8c9e9e75ac0eb7',
#   name: 'Attack on facilities - personnel killed',
#   description: 'Violation totals',
#   module_ids: [PrimeroModule::MRM],
#   record_type: 'violation',
#   aggregate_by: ['category'],
#   aggregate_counts_from: 'facility_staff_killed_attack',
#   filters: default_filters + [
#     {'attribute' => 'category', 'value' => ['attack_on']}
#   ],
#   is_graph: false,
#   editable: false
# })

# Report.create_or_update({
#   id: '525cc6499489486a811e8065ebed599f',
#   name: 'Attack on facilities - personnel injured',
#   description: 'Violation totals',
#   module_ids: [PrimeroModule::MRM],
#   record_type: 'violation',
#   aggregate_by: ['category'],
#   aggregate_counts_from: 'facility_staff_injured_attack',
#   filters: default_filters + [
#     {'attribute' => 'category', 'value' => ['attack_on']}
#   ],
#   is_graph: false,
#   editable: false
# })

# Report.create_or_update({
#   id: '29c7da1d726f706223c1c7764796756c',
#   name: 'Military use of facilities - Number of children affected by service disruption',
#   description: 'Violation totals',
#   module_ids: [PrimeroModule::MRM],
#   record_type: 'violation',
#   aggregate_by: ['category'],
#   aggregate_counts_from: 'number_children_service_disruption',
#   filters: default_filters + [
#       {'attribute' => 'category', 'value' => ['military_use']}
#   ],
#   is_graph: false,
#   editable: false
# })

# Report.create_or_update({
#   id: '74455931e62445febd72e8533b9f40da',
#   name: 'Children affected by Violations',
#   description: 'Violation categories by sex',
#   module_ids: [PrimeroModule::MRM],
#   record_type: 'violation',
#   aggregate_by: ['category'],
#   aggregate_counts_from: 'violation_tally',
#   filters: default_filters,
#   is_graph: true,
#   editable: false
# })

# Report.create_or_update({
#   id: '0e835dbfdf984784b2b3b3942caf2d23',
#   name: 'Violation categories by armed groups',
#   description: 'Violation totals',
#   module_ids: [PrimeroModule::MRM],
#   record_type: 'violation',
#   aggregate_by: ['armed_force_group_names', 'category'],
#   filters: default_filters,
#   is_graph: true,
#   editable: false
# })

# #TODO: Violation Type Totals by Armed Group (Girls, Boys, Unknown, Total)
# Report.create_or_update({
#   id: 'd57a3e038db2480d932f51c3f00afec0',
#   name: 'Individual violations by armed groups',
#   description: 'Violation totals',
#   module_ids: [PrimeroModule::MRM],
#   record_type: 'violation',
#   aggregate_by: ['armed_force_group_names', 'category'],
#   aggregate_counts_from: 'violation_tally',
#   filters: default_filters + [
#     {'attribute' => 'category', 'value' => ['killing', 'maiming', 'recruitment', 'sexual_violence', 'abduction']}
#   ],
#   is_graph: true,
#   editable: false
# })