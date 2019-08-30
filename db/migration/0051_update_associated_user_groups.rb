timestamp = DateTime.now.strftime('%Y%m%d.%I%M')                                
log_filename = "associated-user-groups-logs#{timestamp}.txt"                             
@log = Logger.new(log_filename)                                                 
@log.formatter = proc do |severity, datetime, progname, msg|                    
  "#{severity}: #{msg}\n"                                                       
end  

Child.each_slice do |children|
  children_to_update = children.select{ |child| child.assigned_user_names.present? }
  @log.info("Records to update: #{children_to_update.size}")
  children_to_update.each do |child|
    @log.info("Update id => #{child.id}, assigned_user_names => #{child.assigned_user_names}")
    child.update_associated_user_groups
    @log.info("Updated id => #{child.id}, associated_user_groups => #{child.associated_user_groups}")
  end
  Child.save_all!(children_to_update)
  @log.info("Done")
end