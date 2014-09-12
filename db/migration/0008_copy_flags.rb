#PRIMERO-491

[Child, Incident, TracingRequest].each do |model|
  #Copy Flags from the plain properties to the array of flags.
  model.all.all.each do |record|
    if record[:flag]
      user = record.histories.select{|h| h["changes"]["flag"]}.first["user_name"]
      flags = [Flag.new(:message => record["flag_message"], :flagged_by => user)]
      record[:flags] = flags
      record.save!
    end
  end

  #Remove properties
  model.all.rows.map {|r| model.database.get(r["id"]) }.each do |inst|
    ["flag_message", "flag_date", "flag"].each do |field_name|
      if inst[field_name]
        inst.delete(field_name)
        inst.save
        puts "Deleted key #{field_name} from #{model.name} #{inst['_id']}"
      end
    end
  end
end
