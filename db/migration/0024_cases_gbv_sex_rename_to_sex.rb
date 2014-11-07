#PRIMERO-793

#Create sex field by copy gbv_sex field to.
Child.all.all.each do |child|
  if child["gbv_sex"].present?
    child.update_attributes(sex: child["gbv_sex"])
    if child.valid?
      puts "Child #{child.id} renamed gbv_sex to sex ..."
      child.save!
    else
      puts "Child #{child.id} not valid ..."
    end
  end
end

#Removing gbv_sex property.
Child.all.rows.map {|r| Child.database.get(r["id"]) }.each do |inst|
  if inst["gbv_sex"]
    inst.delete("gbv_sex")
    inst.save
    puts "Deleted key gbv_sex from child #{inst['_id']}"
  end
end
