Incident.all.each do |inc|
  related_forms = {
    'group_details_section' => 'group_violations',
    'perpetrator_subform_section' => 'perpetrator_violations',
    'source_subform_section' => 'source_violations',
    'individual_details_subform_section' => 'individual_violations',
  }

  related_forms.each do |(rf_name, violation_link_field)|
    rf_arr = inc[rf_name]
    if rf_arr.nil?
      next
    end

    rf_arr.each do |rf|
      new_rfs = rf[violation_link_field].map do |violation_link|
        new_link = nil
        md = violation_link.match(/\d+$/)
        unless md.nil?
          idx = md[0].to_i
          violation_type_human = violation_link.match(/^[^-\d]*/)[0].strip
          violation_type = violation_type_human.underscore.gsub(/ /, '_')
          vs = inc.violations[violation_type]
          unless vs.nil?
            violation = vs[idx]
            unless violation.nil?
              new_link = violation['unique_id']
            end
          end
        end

        if new_link
          new_link
        else
          puts "Invalid violation link: #{violation_link}"
          nil
        end
      end

      rf.__send__("#{violation_link_field}=", new_rfs.compact)
    end
  end

  inc.save!
end

