
#Violation attributes
#type
violation_types = ['killing', 'maiming', 'recruitment', 'sexual_violence', 'abduction', 'attack_on_schools', 'attack_on_hospitals', 'denial_humanitarian_access', 'other_violation']
violation_type_id_fields =  {
  'killing' => ['kill_cause_of_death',[
    "IED",
    "IED - Command Activated",
    "UXO/ERW",
    "Landmines",
    "Cluster Munitions",
    "Shooting",
    "Artillery - Shelling/Mortar Fire",
    "Artillery - Cluster Munitions",
    "Aerial Bombardment",
    "White Weapon Use",
    "Gas",
    "Suicide Attack Victim",
    "Perpetrator of Suicide Attack",
    "Cruel and Inhumane Treatment",
    "Summary and Arbitrary Execution/ Extra Judicial Killing"]],
  'maiming' => ['maim_cause_of',[
    "IED",
    "IED - Command Activated",
    "UXO/ERW",
    "Landmines",
    "Cluster Munitions",
    "Shooting",
    "Artillery - Shelling/Mortar Fire",
    "Artillery - Cluster Munitions",
    "Aerial Bombardment",
    "White Weapon Use",
    "Gas",
    "Suicide Attack Victim",
    "Perpetrator of Suicide Attack",
    "Cruel and Inhumane Treatment"]],
  'recruitment' => ['factors_of_recruitment',[
    "Abduction",
    "Conscription",
    "Intimidation",
    "Lack of Basic Services",
    "Access to Security",
    "Financial Reasons",
    "Family Problems / Abuse",
    "To Join / Follow Friends",
    "Idealism",
    "To Seek Revenge",
    "Other",
    "Unknown"]],
  'sexual_violence' => ['sexual_violence_type',[
    "Rape",
    "Sexual Assault",
    "Forced Marriage",
    "Mutilation",
    "Forced Sterilization",
    "Other"
  ]],
  'abduction' => ['abduction_purpose',[
    "Child Recruitment",
    "Child Use",
    "Sexual Violence",
    "Political Indoctrination",
    "Hostage (Intimidation)",
    "Hostage (Extortion)",
    "Unknown",
    "Other"
  ]],
  'attack_on_schools' => ['site_attack_type',[
    "Shelling",
    "Arson",
    "Aerial Bombardment",
    "Theft/Looting",
    "Occupation of Building",
    "Direct Attack on students/teachers",
    "Intimidation of Individuals",
    "Direct attack on medical person",
    "Physical Destruction",
    "Other"
  ]],
  'attack_on_hospitals' => ['site_attack_type_hospital',[
    "Shelling",
    "Arson",
    "Aerial Bombardment",
    "Theft/Looting",
    "Occupation of Building",
    "Direct Attack on students/teachers",
    "Intimidation of Individuals",
    "Direct attack on medical person",
    "Physical Destruction",
    "Other"
  ]],
  'denial_humanitarian_access' => ['denial_method',[
    "Entry Restrictions of Personnel",
    "Import Restrictions for Goods",
    "Travel Restrictions in Country",
    "Threats and Violence Against Personnel",
    "Interference in Humanitarian Operations",
    "Hostage/Abduction of Personnel",
    "Conflict/Hostilities Impeding Access",
    "Vehicle Hijacking",
    "Restriction of Beneficiaries Access",
    "Intimidation"
  ]],
  'other_violation' => ['violation_other_type',[
    "Forced Displacement",
    "Denial of Civil Rights",
    "Use of Children for Propaganda",
    "Access Violations"
  ]]
}
#verification status
verification_status = [
  "Verified",
  "Unverified",
  "Pending Verification",
  "Falsely Attributed",
  "Rejected"]

locations = [
  "Lower Juba",
  "Middle Juba",
  "Gedo",
  "Bay",
  "Bakool",
  "Lower Shebelle",
  "Banaadir",
  "Middle Shebelle",
  "Hiran",
  "Galguduud",
  "Mudug",
  "Nugal",
  "Bari",
  "Sool",
  "Sanaag",
  "Togdheer",
  "Woqooyi Galbeed",
  "Awdal",
]

status = ['open', 'closed']

(0..200).each do |i|
  #violations
  violations = {}
  (0..rand(7)).each do
    type = violation_types[rand(violation_types.size)]
    violation_id_field = violation_type_id_fields[type][0]
    violation_id_value = violation_type_id_fields[type][1][rand(violation_type_id_fields[type][1].size)]
    violation_id_value = [violation_id_value] if ['recruitment', 'sexual_violence'].include? type
    violation = {
      'unique_id' => UUIDTools::UUID.random_create.to_s,
      'violation_tally_boys' => rand(10),
      'violation_tally_girls' => rand(10),
      'violation_tally_unknown' => rand(10),
      violation_id_field => violation_id_value,
      'verified' => verification_status[rand(verification_status.size)]
    }
    if violations[type].present?
      violations[type] << violation
    else
      violations[type] = [violation]
    end
  end

  #incident
  attributes = {
    'incident_code' => "TEST_INCIDENT_#{DateTime.now.strftime('%Y%m%d_%H%M%S')}_#{i}",
    'violation_category' => violations.keys,
    'date_of_incident' => rand(400).days.ago,
    'incident_location' => locations[rand(locations.size)],
    'incident_total_tally_boys' => rand(20),
    'incident_total_tally_girls' => rand(20),
    'incident_total_tally_unknown' => rand(20),
    'status' => status[rand(status.size)],
    'record_state' => true,
    'module_id' => 'primeromodule-mrm',
    'violations' => violations
  }
  Incident.create!(attributes)
end


