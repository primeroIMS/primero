default_owner = User.find_by_user_name("primero_mrm")

#Violation attributes
#type
violation_types = ['killing', 'maiming', 'recruitment', 'sexual_violence', 'abduction', 'attack_on', 'denial_humanitarian_access', 'military_use']

# From AttackType lookup
attack_types = [
  "Aerial attack",
  "Arson",
  "Improvised Explosive Device (IED) attack (select the corresponding weapon in the ‘Type of weapon dropdown menu)",
  "Land-based attack",
  "Laying mines (includes pressure-plate IEDs and booby traps)",
  "Occupation of building(s)",
  "Other shooting",
  "Physical assault",
  "Sea-based attack",
  "Shooting (e.g. sniper)",
  "Tactical use of building(s)",
  "Threat/Intimidation/Harassment",
  "Unmanned aerial vehicle (UAV) (e.g. drone)",
  "Other"
]

# From WeaponType lookup
weapon_types = [
  "Aerial bomb",
  "Barrel bomb",
  "Booby trap",
  "Biological weapons",
  "Chemical weapons",
  "Dirty/atomic weapons (e.g. depleted uranium ammunition)",
  "Explosive remnant of war – ERW (includes unexploded ordnance and abandoned ordnance)",
  "Improvised Explosive Device (IED) – Command-wire operated",
  "Improvised Explosive Device (IED) – Flying IED",
  "Improvised Explosive Device (IED) - Person-borne IED",
  "Improvised Explosive Device (IED) - Remote-controlled IED",
  "Improvised Explosive Device (IED) - Timer-operated IED",
  "Improvised Explosive Device (IED) - Vehicle-borne IED",
  "Improvised Explosive Device (IED) - Grenade",
  "Landmine (includes anti-personnel and anti-vehicle landmine, both factory-made and improvised, and pressure-plate IEDs)",
  "Light weapons (designed to be used by several persons, i.e. heavy machine guns, air defence weapons, etc.)",
  "Missile",
  "Mortar/Rocket",
  "Sharp weapon",
  "Small arm (e.g. AK-47)",
  "Submunition (e.g. cluster munitions)",
  "Other weapon",
  "Unknown"
]
violation_type_id_fields =  {
  'killing' => ['attack_type', attack_types, 'weapon_type', weapon_types],
  'maiming' => ['attack_type', attack_types, 'weapon_type', weapon_types],
  'recruitment' => ['factors_of_recruitment',[
    "Abduction",
    "Conscription",
    "Family/community pressure",
    "Family problems/abuse",
    "Financial reasons",
    "Idealism",
    "Intimidation",
    "Lack of basic services",
    "Security concerns",
    "To join/follow friends",
    "To seek revenge",
    "Unknown",
    "Other"]],
  'sexual_violence' => ['sexual_violence_type',[
    "Rape",
    "Sexual assault",
    "Sexual slavery and/or trafficking",
    "Enforced prostitution",
    "Enforced sterilization",
    "Forced pregnancy",
    "Forced abortion",
    "Forced marriage",
    "Sexual mutilation"]],
  'abduction' => ['abduction_purpose',[
    "Extortion",
    "Forced marriage",
    "Indoctrination",
    "Intimidation",
    "Killing/Maiming",
    "Punishment",
    "Recruitment and use",
    "Rape and/or other forms of sexual violence",
    "Forced labour",
    "Sale of children",
    "Trafficking of children",
    "Enslavement",
    "Unknown",
    "Other"]],
  'attack_on' => ['facility_attack_type',[
    "Attack on school(s)",
    "Attack on education personnel",
    "Threat of attack on school(s)",
    "Other interference with education",
    "Attack on hospital(s)",
    "Attack on medical personnel",
    "Threat of attack on hospital(s)",
    "Other interference with healthcare"], 'weapon_type', weapon_types],
  'denial_humanitarian_access' => ['denial_method',[
    "Abduction of humanitarian personnel",
    "Besiegement",
    "Entry restrictions for humanitarian personnel",
    "Import restrictions for relief goods",
    "Financial restrictions on humanitarian organizations",
    "Property damage",
    "Theft",
    "Restrictions of beneficiaries' access",
    "Threats/violence against beneficiaries",
    "Threats/violence against humanitarian personnel",
    "Travel restrictions in country",
    "Vehicle hijacking",
    "Other"]],
  'military_use' => ['military_use_type',[
    "Forced Displacement",
    "Denial of Civil Rights",
    "Use of Children for Propaganda",
    "Access Violations"
  ], 'weapon_type', weapon_types]
}
#verification status
verification_status = [
  "Verified",
  "Unverified",
  "Pending Verification",
  "Falsely Attributed",
  "Rejected"]

ctfmr_verification_status = [
  "Verified",
  "Report pending verification",
  "Not MRM",
  "Verification found that incident did not occur"
]

locations = [
  "Somalia::Lower Juba",
  "Somalia::Middle Juba",
  "Somalia::Gedo",
  "Somalia::Bay",
  "Somalia::Bakool",
  "Somalia::Lower Shabelle",
  "Somalia::Banadir",
  "Somalia::Middle Shabelle",
  "Somalia::Galgadud",
  "Somalia::Mudug"
]

status = ['Open', 'Closed']

(0..100).each do |i|
  #violations
  violations = {}
  (0..rand(7)).each do
    type = violation_types[rand(violation_types.size)]
    violation_id_field = violation_type_id_fields[type][0]
    violation_id_value = violation_type_id_fields[type][1][rand(violation_type_id_fields[type][1].size)]
    violation_id_value = [violation_id_value] if ['recruitment', 'sexual_violence', 'abduction', 'attack_on', 'denial_humanitarian_access'].include? type
    violation = {
      'unique_id' => UUIDTools::UUID.random_create.to_s,
      'violation_tally_boys' => rand(10),
      'violation_tally_girls' => rand(10),
      'violation_tally_unknown' => rand(10),
      violation_id_field => violation_id_value,
      'verified' => verification_status[rand(verification_status.size)],
      'ctfmr_verified' => ctfmr_verification_status[rand(ctfmr_verification_status.size)]
    }
    secondary_violation_id_field = violation_type_id_fields[type][2]
    if secondary_violation_id_field
      secondary_violation_id_field_value = violation_type_id_fields[type][3][rand(violation_type_id_fields[type][3].size)]
      violation[secondary_violation_id_field] = secondary_violation_id_field_value
    end
    if violations[type].present?
      violations[type] << violation
    else
      violations[type] = [violation]
    end
  end

  #incident
  days_since_incident = rand(400) + 10
  days_since_first_report = days_since_incident + rand(10)
  incident_date = days_since_incident.days.ago
  incident_report_date = days_since_first_report.days.ago
  attributes = {
    'incident_code' => "TEST_INCIDENT_#{DateTime.now.strftime('%Y%m%d_%H%M%S')}_#{i}",
    'violation_category' => violations.keys,
    'date_of_incident_date_or_date_range' => 'date',
    'date_of_incident' => incident_date,
    'date_of_first_report' => incident_report_date,
    'incident_location' => locations[rand(locations.size)],
    'incident_total_tally_boys' => rand(20),
    'incident_total_tally_girls' => rand(20),
    'incident_total_tally_unknown' => rand(20),
    'status' => status[rand(status.size)],
    'record_state' => true,
    'module_id' => 'primeromodule-mrm',
    'violations' => violations
  }

  incident = Incident.new_with_user_name(default_owner, attributes)
  incident.save!
end
