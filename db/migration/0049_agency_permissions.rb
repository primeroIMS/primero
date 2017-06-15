puts 'Searching for roles with User permissions'
Role.all.rows.map{|r| Role.database.get(r["id"]) }.each do |record|
  permissions_list = record['permissions_list'].map{|pl| pl['resource']}
  if permissions_list.include?('user') && permissions_list.exclude?('agency')
    agency_resource = record['permissions_list'].select{|pl| pl['resource'] == 'user'}.first.dup
    agency_resource['resource'] = 'agency'
    record['permissions_list'] << agency_resource
    puts "Updating role #{record['_id']}"
    record.save
  end
end
