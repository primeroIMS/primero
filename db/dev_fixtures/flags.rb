def create_flag(mod, flag_n)
    users = []
    username = "primero" #if it does't find any
    User.all.each do |u|
        if u.modules.include? mod
            users.push(u)
        end
    end
    if users.any?
        random = rand(users.count)
        username= users.drop(random).first.user_name
    end

    time_range = 60 #Time range in days
    random_time_offset = rand(time_range) - time_range/2 #Random offset, today in the middle

    #New Flag and properties
    f = Flag.new
    f.unique_id = "F#{flag_n}"
    
    f.date = DateTime.now + random_time_offset
    f.message = "reasonable"
    f.flagged_by = username
    f.created_at = DateTime.now
    
    #1 out of 3 flags are removed
    if flag_n%3 == 0
        f.removed = true
        f.unflag_message = "reason wasn't reasonable"
    end
    f
end

#Flag.all.each &:destroy

flags_for_cases = 1
flags_for_incidents = 1

children = Child.all

flags = (0..flags_for_cases).each do |i|

    #Random child
    random = rand(children.count)
    child = children.drop(random).first

    #Random user that has access to the module
    mod = child.module

    f = create_flag(mod, i)
    
    #Add flag to child and save it
    child.flags.push(f)
    puts "Child #{child.unique_identifier} and name: #{child.name} updated with flag #{f.unique_id}"
    child.save!
end

incidents = Incident.all

(0..flags_for_incidents).each do |i|

    random = rand(incidents.count)
    incident = incidents.drop(random).first

    mod = PrimeroModule.last
    
    f = create_flag(mod, i)
    
    #Add flag to incident and save it
    incident.flags.push(f)
    puts "Incident #{incident.unique_id} updated with flag #{f.unique_id}"
end
