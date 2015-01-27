#To generate the UUID, run the following in the rails consle:
#    UUIDTools::UUID.random_create.to_s.gsub('-','')

default_filters = [
  {'attribute' => 'status', 'value' => ['Open']},
  {'attribute' => 'record_state', 'value' => ['true']}
]

Report.create_or_update({
  id: '0cf3ca40fa334ae697ba5066cd25d7ca',
  name: 'Violations by Country by Cause ',
  description: 'Breakdown of all killings and maimings by country by cause',
  module_ids: [PrimeroModule::MRM],
  record_type: 'violation',
  aggregate_by: ['incident_location', 'cause'],
  filters: default_filters + [
    {'attribute' => 'type', 'value' => ['killing', 'maiming']}
  ],
  is_graph: true,
  editable: false
})

Report.create_or_update({
  id: 'a897ddcdbb72490cbbac2e5313ece3ef',
  name: 'Cause of Killing or Maiming',
  description: 'Children affected by killings and maimings broken down by cause',
  module_ids: [PrimeroModule::MRM],
  record_type: 'violation',
  aggregate_by: ['cause'],
  aggregate_counts_from: 'violation_tally',
  filters: default_filters + [
    {'attribute' => 'type', 'value' => ['killing', 'maiming']}
  ],
  is_graph: true,
  editable: false
})

Report.create_or_update({
  id: 'ccb4c0e8104c4e2992e2fdd686fdfcc5',
  name: 'Verification Status',
  description: 'Violations by verification status',
  module_ids: [PrimeroModule::MRM],
  record_type: 'violation',
  aggregate_by: ['verified'],
  filters: default_filters,
  is_graph: true,
  editable: false
})

#TODO: Attacks on Protection Personnel

Report.create_or_update({
  id: '74455931e62445febd72e8533b9f40da',
  name: 'Children affected by Violations',
  description: 'Violation categories by sex',
  module_ids: [PrimeroModule::CP],
  record_type: 'violation',
  aggregate_by: ['category'],
  aggregate_counts_from: 'violation_tally',
  filters: default_filters,
  is_graph: true,
  editable: false
})

#TODO: Violation Type Totals by Armed Group (Girls, Boys, Unknown, Total)