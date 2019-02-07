module Mrm
  class ViolationFilter
    FIELDS = {
      killing: {
        "killing_context_km" => "context_km",
        "killing_attack_type" => "attack_type",
        "killing_weapon_type" => "weapon_type",
        "killing_victim_targeted" => "victim_targeted",
        "killing_victim_a_participant" => "victim_a_participant",
        "killing_crossborder" => "killing_crossborder"
      },
      maiming: {
        "maiming_context_km" => "context_km",
        "maiming_attack_type" => "attack_type",
        "maiming_weapon_type" => "weapon_type",
        "maiming_victim_targeted" => "victim_targeted",
        "maiming_victim_a_participant" => "victim_a_participant",
        "maiming_crossborder" => "maiming_crossborder"
      },
      recruitment: {
        "recruitment_re_recruitment" => "re_recruitment",
        "recruitment_child_role" => "child_role",
        "recruitment_crossborder" => "recruitment_crossborder"
      },
      sexual_violence: {
        "sexual_violence_type" => "sexual_violence_type",
        "sexual_violence_crossborder" => "sexual_violence_crossborder"
      },
      abduction: {
        "abduction_purpose" => "abduction_purpose",
        "abduction_regained_freedom" => "abduction_regained_freedom",
        "abduction_crossborder" => "abduction_crossborder",
        "abduction_regained_freedom_how" => "abduction_regained_freedom_how"
      },
      attack_on: {
        "attacks_schools_facility_attack_type" => "facility_attack_type",
        "attacks_schools_attack_type" => "attack_type",
        "attacks_schools_weapon_type" => "weapon_type",
        "attacks_schools_recurrent_attack" => "recurrent_attack",
        "attacks_schools_facility_operational_before" => "facility_operational_before",
        "attacks_schools_crossborder" => "attacks_schools_crossborder",
        "attacks_schools_school_type" => "school_type",
        "attacks_schools_health_type" => "health_type",
        "attacks_schools_facility_impact" => "facility_impact"
      },
      military_use: {
        "military_use_type" => "military_use_type",
        "military_use_facility_operational_before" => "facility_operational_before",
        "military_use_crossborder" => "military_use_crossborder",
        "military_use_school_type" => "school_type",
        "military_use_health_type" => "health_type",
        "military_use_facility_impact" => "facility_impact"
      },
      denial_humanitarian_access: {
        "denial_method" => "denial_method",
        "denial_organizations_affected" => "denial_organizations_affected",
        "denial_crossborder" => "denial_crossborder",
        "denial_types_of_aid_disrupted_denial" => "denial_types_of_aid_disrupted_denial"
      }
    }
  end
end