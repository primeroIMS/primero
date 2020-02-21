# #To generate the UUID, run the following in the rails console:
# #    UUIDTools::UUID.random_create.to_s.gsub('-','')

default_filters = [
  {'attribute' => 'status', 'value' => ['Open']},
  {'attribute' => 'record_state', 'value' => ['true']}
]

default_ui_filters = [
  {
    type: 'date',
    name: 'date_of_incident',
  },
  {
    type: 'select',
    name: 'ctfmr_verified',
    options: 'lookup-verification-status',
    multiple: true,
  },
  {
    type: 'select',
    name: 'perpetrator_categories',
    options: ["Armed force", "Armed group", "Other party to the conflict", "Unknown"],
    multiple: true
  },
  {
    type: 'select',
    name: 'armed_force_names',
    options: 'lookup-armed-force-name',
    multiple: true,
  },
  {
    type: 'select',
    name: 'armed_group_name',
    options: 'lookup-armed-group-name',
    multiple: true,
  },
  {
    type: 'select',
    name: 'armed_party_appropiate',
    options: 'lookup-other-party-name',
    multiple: true
  },
  {
    type: 'select',
    name: 'incident_location',
    options: 'Location',
    multiple: true,
    location_filter: true
  }
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
  editable: false,
  ui_filters: default_ui_filters
})

Report.create_or_update({
  id: 'd8cef9234f894afb9ef434f2ab8081b5',
  name: 'Individual Children by Violation Type ',
  description: 'Individual Children by Violation Type ',
  module_ids: [PrimeroModule::MRM],
  record_type: 'individual_victim',
  aggregate_by: ['individual_violations'],
  disaggregate_by: ['individual_sex'],
  filters: default_filters,
  is_graph: false,
  editable: false,
  ui_filters: default_ui_filters + [
    { type: 'select', name: 'individual_age', options: ['0-15', '16-18'], multiple: false },
    { type: 'select', name: 'individual_violations', 
      options: [
        { id: 'killing', display_text: "Killing of Children" },
        { id: 'maiming', display_text: "Maiming of Children" },
        { id: 'abduction', display_text: "Abduction" },
        { id: 'recruitment', display_text: "Recruitment and/or use of children" },
        { id: 'sexual_violence', display_text: "Rape and/or other forms of sexual violence" },
        { id: 'attack_on', display_text: "Attacks on schools and/or hospitals" },
        { id: 'military_use', display_text: "Military use of schools and/or hospitals" },
        { id: 'denial_humanitarian_access', display_text: "Denial of humanitarian access for children" }
      ],
      multiple: false 
    },
    {
      type: 'select',
      name: 'individual_sex',
      options: ["Male", "Female", "Unknown"],
      multiple: true
    }
  ]
})


Report.create_or_update({
  id: 'cf8c10098bf24886bac8d8026819409f',
  name: 'Maiming of Children',
  description: 'Maiming of Children by CTFMR verification status',
  module_ids: [PrimeroModule::MRM],
  record_type: 'violation',
  aggregate_by: ['ctfmr_verified'],
  aggregate_counts_from: 'violation_tally',
  filters: default_filters + [
      {'attribute' => 'category', 'value' => ['maiming']}
  ],
  is_graph: false,
  editable: false,
  ui_filters: default_ui_filters
})

Report.create_or_update({
  id: '9582de157db046f5a89b67a7c07eed88',
  name: 'Rape and/or other forms of sexual violence',
  description: 'Rape and/or other forms of sexual violence by CTFMR verification status',
  module_ids: [PrimeroModule::MRM],
  record_type: 'violation',
  aggregate_by: ['ctfmr_verified'],
  aggregate_counts_from: 'violation_tally',
  filters: default_filters + [
      {'attribute' => 'category', 'value' => ['sexual_violence']}
  ],
  is_graph: false,
  editable: false,
  ui_filters: default_ui_filters
})

Report.create_or_update({
  id: 'e1161bed36cd48178dbda8c14f3078b9',
  name: 'Abduction',
  description: 'Abduction by CTFMR verification status',
  module_ids: [PrimeroModule::MRM],
  record_type: 'violation',
  aggregate_by: ['ctfmr_verified'],
  aggregate_counts_from: 'violation_tally',
  filters: default_filters + [
      {'attribute' => 'category', 'value' => ['abduction']}
  ],
  is_graph: false,
  editable: false,
  ui_filters: default_ui_filters
})

Report.create_or_update({
  id: '331e70efc07b4938a2fe1129d811ce73',
  name: 'Recruitment and/or use of children',
  description: 'Recruitment and/or use of children by CTFMR verification status',
  module_ids: [PrimeroModule::MRM],
  record_type: 'violation',
  aggregate_by: ['ctfmr_verified'],
  aggregate_counts_from: 'violation_tally',
  filters: default_filters + [
      {'attribute' => 'category', 'value' => ['recruitment']}
  ],
  is_graph: false,
  editable: false,
  ui_filters: default_ui_filters
})

Report.create_or_update({
  id: '5d2fc05c43ba4d68a931cad30efe05f5',
  name: 'Attacks on schools',
  description: 'Attacks on schools by CTFMR verification status',
  module_ids: [PrimeroModule::MRM],
  record_type: 'violation',
  aggregate_by: ['ctfmr_verified'],
  filters: default_filters + [
      {'attribute' => 'category', 'value' => ['attack_on']},
      {'attribute' => 'school_type', 'value' => ['not_null']},
      {'attribute' => 'facility_attack_type', 'value' => ['not_null']}
  ],
  is_graph: false,
  editable: false,
  ui_filters: default_ui_filters
})

Report.create_or_update({
  id: '9b6a5875c17447c7b0e85534dcf2a766',
  name: 'Attacks on hospitals',
  description: 'Attacks on hospitals by CTFMR verification status',
  module_ids: [PrimeroModule::MRM],
  record_type: 'violation',
  aggregate_by: ['ctfmr_verified'],
  filters: default_filters + [
      {'attribute' => 'category', 'value' => ['attack_on']},
      {'attribute' => 'health_type', 'value' => ['not_null']},
      {'attribute' => 'facility_attack_type', 'value' => ['not_null']}
  ],
  is_graph: false,
  editable: false,
  ui_filters: default_ui_filters
})

Report.create_or_update({
  id: '034686e163e94b1d9b033293ffcde822',
  name: 'Attacks on schools and hospitals',
  description: 'Attacks on schools and hospitals by CTFMR verification status',
  module_ids: [PrimeroModule::MRM],
  record_type: 'violation',
  aggregate_by: ['ctfmr_verified'],
  filters: default_filters + [
      {'attribute' => 'category', 'value' => ['attack_on']},
      {'attribute' => 'facility_attack_type', 'value' => ['not_null']}
  ],
  is_graph: false,
  editable: false,
  ui_filters: default_ui_filters
})

#####

Report.create_or_update({
  id: 'b55d7ea3f12a48958baf980fca8e923f',
  name: 'Military use of schools',
  description: 'Military use of schools by CTFMR verification status',
  module_ids: [PrimeroModule::MRM],
  record_type: 'violation',
  aggregate_by: ['ctfmr_verified'],
  filters: default_filters + [
      {'attribute' => 'category', 'value' => ['military_use']},
      {'attribute' => 'school_type', 'value' => ['not_null']},
      {'attribute' => 'military_use_type', 'value' => ['not_null']}
  ],
  is_graph: false,
  editable: false,
  ui_filters: default_ui_filters
})

Report.create_or_update({
  id: 'a657a87b81fb4b1a9d2947a45ebf2592',
  name: 'Military use of hospitals',
  description: 'Military use of hospitals by CTFMR verification status',
  module_ids: [PrimeroModule::MRM],
  record_type: 'violation',
  aggregate_by: ['ctfmr_verified'],
  filters: default_filters + [
      {'attribute' => 'category', 'value' => ['military_use']},
      {'attribute' => 'health_type', 'value' => ['not_null']},
      {'attribute' => 'military_use_type', 'value' => ['not_null']}
  ],
  is_graph: false,
  editable: false,
  ui_filters: default_ui_filters
})

Report.create_or_update({
  id: '48f6070ad24f447ea9603a0430eaaf0c',
  name: 'Military use of schools and hospitals',
  description: 'Military use of  schools and hospitals by CTFMR verification status',
  module_ids: [PrimeroModule::MRM],
  record_type: 'violation',
  aggregate_by: ['ctfmr_verified'],
  filters: default_filters + [
      {'attribute' => 'category', 'value' => ['military_use']},
      {'attribute' => 'military_use_type', 'value' => ['not_null']}
  ],
  is_graph: false,
  editable: false,
  ui_filters: default_ui_filters
})

Report.create_or_update({
  id: 'b44c175ec403416caeedb55b90424fe9',
  name: 'Denial of humanitarian access for children',
  description: 'Denial of humanitarian access for children by CTFMR verification status',
  module_ids: [PrimeroModule::MRM],
  record_type: 'violation',
  aggregate_by: ['ctfmr_verified'],
  filters: default_filters + [
      {'attribute' => 'category', 'value' => ['denial_humanitarian_access']},
      {'attribute' => 'denial_method', 'value' => ['not_null']}
  ],
  is_graph: false,
  editable: false,
  ui_filters: default_ui_filters
})