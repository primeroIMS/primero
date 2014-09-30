incidents = Incident.all
incidents.each do |incident|
  record_modified = false

  if incident.violations.present?
    incident.violations.to_hash.each do |key, value|
      value.each do |v|
        if key == 'killing'
          v.violation_tally_boys = v[:violation_killing_tally_boys] if v[:violation_killing_tally_boys].present?
          v.violation_tally_girls = v[:violation_killing_tally_girls] if v[:violation_killing_tally_girls].present?
          v.violation_tally_unknown = v[:violation_killing_tally_unknown] if v[:violation_killing_tally_unknown].present?
        elsif key == 'maiming'
          v.violation_tally_boys = v[:violation_maiming_tally_boys] if v[:violation_maiming_tally_boys].present?
          v.violation_tally_girls = v[:violation_maiming_tally_girls] if v[:violation_maiming_tally_girls].present?
          v.violation_tally_unknown = v[:violation_maiming_tally_unknown] if v[:violation_maiming_tally_unknown].present?
        elsif key == 'recruitment'
          v.violation_tally_boys = v[:violation_recruit_tally_boys] if v[:violation_recruit_tally_boys].present?
          v.violation_tally_girls = v[:violation_recruit_tally_girls] if v[:violation_recruit_tally_girls].present?
          v.violation_tally_unknown = v[:violation_recruit_tally_unknown] if v[:violation_recruit_tally_unknown].present?
        elsif key == 'abduction'
          v.violation_tally_boys = v[:violation_abductions_tally_boys] if v[:violation_abductions_tally_boys].present?
          v.violation_tally_girls = v[:violation_abductions_tally_girls] if v[:violation_abductions_tally_girls].present?
          v.violation_tally_unknown = v[:violation_abductions_tally_unknown] if v[:violation_abductions_tally_unknown].present?
        elsif key == 'sexual_violence'
        elsif key == 'other_violation'
          v.violation_tally_boys = v[:other_violation_tally_boys] if v[:other_violation_tally_boys].present?
          v.violation_tally_girls = v[:other_violation_tally_girls] if v[:other_violation_tally_girls].present?
          v.violation_tally_unknown = v[:other_violation_tally_unknown] if v[:other_violation_tally_unknown].present?
        elsif key == 'attack_on_hospitals'
          v.violation_killed_tally_boys = v[:violation_killed_attack_hospital_tally_boys] if v[:violation_killed_attack_hospital_tally_boys].present?
          v.violation_injured_tally_boys = v[:violation_injured_attack_hospital_tally_boys] if v[:violation_injured_attack_hospital_tally_boys].present?
          v.violation_killed_tally_girls = v[:violation_killed_attack_hospital_tally_girls] if v[:violation_killed_attack_hospital_tally_girls].present?
          v.violation_injured_tally_girls = v[:violation_injured_attack_hospital_tally_girls] if v[:violation_injured_attack_hospital_tally_girls].present?
          v.violation_killed_tally_unknown = v[:violation_killed_attack_hospital_tally_unknown] if v[:violation_killed_attack_hospital_tally_unknown].present?
          v.violation_injured_tally_unknown = v[:violation_injured_attack_hospital_tally_unknown] if v[:violation_injured_attack_hospital_tally_unknown].present?
        elsif key == 'attack_on_schools'
          v.violation_killed_tally_boys = v[:violation_killed_attack_tally_boys] if v[:violation_killed_attack_tally_boys].present?
          v.violation_injured_tally_boys = v[:violation_injured_attack_tally_boys] if v[:violation_injured_attack_tally_boys].present?
          v.violation_killed_tally_girls = v[:violation_killed_attack_tally_girls] if v[:violation_killed_attack_tally_girls].present?
          v.violation_injured_tally_girls = v[:violation_injured_attack_tally_girls] if v[:violation_injured_attack_tally_girls].present?
          v.violation_killed_tally_unknown = v[:violation_killed_attack_tally_unknown] if v[:violation_killed_attack_tally_unknown].present?
          v.violation_injured_tally_unknown = v[:violation_injured_attack_tally_unknown] if v[:violation_injured_attack_tally_unknown].present?
        end
        record_modified = true
      end
    end
  end

  if record_modified
    if incident.valid?
      puts "#{incident.id} - Incident is valid. (saving)"
      incident.save!
    else
      puts "#{incident.id} - Incident still not valid. (not saved)"
    end
  end
end