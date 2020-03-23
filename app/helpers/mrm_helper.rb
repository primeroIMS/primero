module MrmHelper
  def violation_filters
    {
      killing: [
        { name: 'killing_context_km', options: 'lookup-context', multi: true},
        { name: 'killing_attack_type', options: 'lookup-attack-type', multi: true },
        { name: 'killing_weapon_type', options: 'lookup-weapon-type', multi: true },
        { name: 'killing_victim_targeted', options: 'lookup-yes-no-unknown' },
        { name: 'killing_victim_a_participant', options: 'lookup-yes-no-unknown' },
        { name: 'killing_crossborder', options: 'lookup-yes-no-unknown' }
      ],
      maiming: [
        { name: 'maiming_context_km', options: 'lookup-context', multi: true},
        { name: 'maiming_attack_type', options: 'lookup-attack-type', multi: true },
        { name: 'maiming_weapon_type', options: 'lookup-weapon-type', multi: true },
        { name: 'maiming_victim_targeted', options: 'lookup-yes-no-unknown' },
        { name: 'maiming_victim_a_participant', options: 'lookup-yes-no-unknown' },
        { name: 'maiming_crossborder', options: 'lookup-yes-no-unknown' }
      ],
      recruitment: [
        { name: 'recruitment_re_recruitment', options: 'lookup-yes-no-unknown' },
        { name: 'recruitment_child_role', options: 'lookup-combat-role-type' },
        { name: 'recruitment_crossborder', options: 'lookup-yes-no-unknown' }
      ],
      sexual_violence: [
        { name: 'sexual_violence_type', options: 'lookup-mrm-sexual-violence-type', multi: true },
        { name: 'sexual_violence_crossborder', options: 'lookup-yes-no-unknown' }
      ],
      abduction: [
        { name: 'abduction_purpose', options: 'lookup-abduction-purpose', multi: true},
        { name: 'abduction_regained_freedom', options: 'lookup-yes-no-unknown' },
        { name: 'abduction_regained_freedom_how', options: 'lookup-regained-freedom-how', multi: true },
        { name: 'abduction_crossborder', options: 'lookup-yes-no-unknown' }
      ],
      attack_on: [
        { name: 'attacks_schools_facility_attack_type', options: 'lookup-facility-attack-type', multi: true },
        { name: 'attacks_schools_attack_type', options: 'lookup-attack-type', multi: true },
        { name: 'attacks_schools_weapon_type', options: 'lookup-weapon-type', multi: true },
        { name: 'attacks_schools_recurrent_attack', options: 'lookup-yes-no-unknown' },
        { name: 'attacks_schools_facility_operational_before', options: 'lookup-yes-no-partially' },
        { name: 'attacks_schools_crossborder', options: 'lookup-yes-no-unknown' },
        { name: 'attacks_schools_school_type', options: 'lookup-school-type', multi: true },
        { name: 'attacks_schools_health_type', options: 'lookup-healthcare-facility-type' },
        { name: 'attacks_schools_facility_impact', options: 'lookup-facility-impact-type' },
      ],
      military_use: [
        { name: 'military_use_type', options: 'lookup-military-use-type' },
        { name: 'military_use_facility_operational_before', options: 'lookup-yes-no-partially'},
        { name: 'military_use_crossborder', options: 'lookup-yes-no-unknown' },
        { name: 'military_use_school_type', options: 'lookup-school-type', multi: true },
        { name: 'military_use_health_type', options: 'lookup-healthcare-facility-type', multi: true },
        { name: 'military_use_facility_impact', options: 'lookup-facility-impact-type' },
      ],
      denial_humanitarian_access: [
        { name: 'denial_method', options: 'lookup-denial-method', multi: true },
        { name: 'denial_organizations_affected', options: 'lookup-organization-type', multi: true },
        { name: 'denial_crossborder', options: 'lookup-yes-no-unknown' },
        { name: 'denial_types_of_aid_disrupted_denial', options: 'lookup-aid-service-type', multi: true }
      ]
    }
  end
end