class Permission

  def self.to_ordered_hash *hashes
    ordered = ActiveSupport::OrderedHash.new

    hashes.each do |hash|
      hash.each { |key, value| ordered[key] = value }
    end
    ordered
  end

  CHILDREN = Permission.to_ordered_hash({:register => "Create Cases"},
                                        {:edit => "Edit Cases"},
                                        {:view_and_search => "View And Search Cases"},
                                        {:export_photowall => "Export Cases to Photowall"},
                                        {:export_csv => "Export Cases to CSV"},
                                        {:export_pdf => "Export Cases to PDF"},
                                        {:export_cpims => "Export Cases to CPIMS"}
  )
  ENQUIRIES = Permission.to_ordered_hash({:create => "Create Enquires"},
                                         {:update => "Edit Enquires"}
  )
  FORMS = Permission.to_ordered_hash({:manage => "Manage Forms"})
  USERS = Permission.to_ordered_hash({:create_and_edit => "Create and Edit Users"}, {:view => "View Users"},
                                     {:destroy => "Delete Users"}, {:disable => "Disable Users"})
  DEVICES = Permission.to_ordered_hash({:black_list => "BlackList Devices", :replications => "Manage Device Replication"})
  REPORTS = Permission.to_ordered_hash({:view => 'View Reports'})
  ROLES = Permission.to_ordered_hash({:create_and_edit => "Create and Edit Roles"}, {:view => "View roles"})
  SYSTEM = Permission.to_ordered_hash({:contact_information => "Manage Contact Information",
                                       :highlight_fields => "Highlight Fields",
                                       :system_users => "Manage System Users"})
  INCIDENTS = Permission.to_ordered_hash({:register => "Create Incidents"},
                                        {:edit => "Edit Incidents"},
                                        {:view_and_search => "View And Search Incidents"},
                                        {:export_csv => "Export Incidents to CSV"},
                                        {:export_pdf => "Export Incidents to PDF"}
  )
  TRACING_REQUESTS = Permission.to_ordered_hash({:register => "Create Tracing Requests"},
                                        {:edit => "Edit Tracing Requests"},
                                        {:view_and_search => "View And Search Tracing Requests"},
                                        {:export_csv => "Export Tracing Requests to CSV"},
                                        {:export_pdf => "Export Tracing Requests to PDF"}
  )

  def self.all
    {"Cases" => CHILDREN, "Tracing Requests" => TRACING_REQUESTS, "Incidents" => INCIDENTS, "Forms" => FORMS, "Users" => USERS, "Devices" => DEVICES, "Reports" => REPORTS, "Roles" => ROLES, "System" => SYSTEM, "Enquires" => ENQUIRIES}
  end

  def self.all_permissions
    self.all.values.map(&:values).flatten
  end

  #TODO: This is bad code. Use a map{} instead. Why are we even using this?
  def self.hashed_values
    {"Cases" => CHILDREN.values, "Tracing Requests" => TRACING_REQUESTS.values, "Incidents" => INCIDENTS.values, "Forms" => FORMS.values, "Users" => USERS.values, "Devices" => DEVICES.values, "Reports" => REPORTS.values, "Roles" => ROLES.values, "System" => SYSTEM.values, "Enquires" => ENQUIRIES.values}
  end

end
