{
  "ff837102-455b-4735-9e5c-4ed9ainci001" => ->(i) do
    i.date_of_first_report = Date.new(2014, 05, 01)
    i.incident_date = Date.new(2014, 04, 20)
    i.module_id = 'primeromodule-mrm'
    i.violations = {}.tap do |v|
      v[:killing] = [
        {
          :violation_tally_boys => 3,
          :violation_tally_girls => 1,
          :kill_method => 'Summary',
          :kill_cause_of_death => 'Gas',
          :verifier_id_code => 'abcdef',
          :verification_decision_date => Date.new(2014, 05, 03),
          :verified => 'Verified',
        },
        {
          :violation_tally_boys => 0,
          :violation_tally_girls => 1,
          :kill_method => 'Summary',
          :kill_cause_of_death => 'Gas',
          :verifier_id_code => 'maiu45',
          :verification_decision_date => Date.new(2014, 05, 03),
          :verified => 'Unverified',
        },
      ]
    end
    i.perpetrator_subform_section = [
      {:perpetrator_violations => ['Killing 0']}
    ]
  end,
}.each do |k, v|
  default_owner = User.find_by_user_name("primero")
  i = Incident.find_by_unique_identifier(k) || Incident.new_with_user_name(default_owner, {:unique_identifier => k})
  v.call(i)
  puts "Incident #{i.new? ? 'created' : 'updated'}: #{i.unique_identifier}"
  i.save!
end
