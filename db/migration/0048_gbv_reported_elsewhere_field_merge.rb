#Field gbv_reported_elsewhere_reporting was removed and its options were combined into gbv_reported_elsewhere
puts 'Searching for gbv_reported_elsewhere that has not been converted'
Incident.all.rows.map{|r| Incident.database.get(r["id"]) }.each do |record|
  #Only have to merge values where original value was 'Yes'
  if record['gbv_reported_elsewhere'] == 'Yes'
    #Next couple of lines borrowed from old IR report code
    reporting_agency = record['gbv_reported_elsewhere_subform'].reduce(false) {|acc, v| acc || (v['gbv_reported_elsewhere_reporting'] == 'Yes') }
    if reporting_agency
      record['gbv_reported_elsewhere'] = 'Yes-GBVIMS Org / Agency'
    else
      record['gbv_reported_elsewhere'] = 'Yes-Non GBVIMS Org / Agency'
    end
    puts "Updating incident #{record['short_id']}"
    record.save
  end
end
