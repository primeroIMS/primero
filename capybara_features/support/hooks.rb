# Generating large audio/photo. Rspec only created the files. The rspec and cucumber test run on
# different envs on the jenkins server, so the files were not being generated for cucumber.

include UploadableFiles
uploadable_large_photo
uploadable_large_audio

Before do
  Child.stub :index_record => true, :reindex! => true, :build_solar_schema => true
  Sunspot.stub :index => true, :index! => true
end

Before('@search') do
  RSpec::Mocks.proxy_for(Child).reset
  RSpec::Mocks.proxy_for(Sunspot).reset
  Sunspot.remove_all!(Child)
  Sunspot.remove_all!(Enquiry)
end

Before('@clean_db') do
  CouchRest::Model::Base.descendants.each do |model|
    if model.name == 'Child' || model.name == 'Incident'
      puts "Deleting all rows in #{model.name}"
      docs = model.database.documents["rows"].map { |doc|
        { "_id" => doc["id"], "_rev" => doc["value"]["rev"], "_deleted" => true } unless doc["id"].include? "_design"
      }.compact
      RestClient.post "#{model.database.root}/_bulk_docs", { :docs => docs }.to_json, { "Content-type" => "application/json" } unless docs.empty?
    end
  end
end

Before do
  I18n.locale = I18n.default_locale = :en
  #TODO - Figure out how to whack only incidents and cases
  # CouchRest::Model::Base.descendants.each do |model|
    # docs = model.database.documents["rows"].map { |doc|
      # { "_id" => doc["id"], "_rev" => doc["value"]["rev"], "_deleted" => true } unless doc["id"].include? "_design"
    # }.compact
    # RestClient.post "#{model.database.root}/_bulk_docs", { :docs => docs }.to_json, { "Content-type" => "application/json" } unless docs.empty?
  # end

  #Only load the seed files ONCE.
  #Don't load the seed data on every scenario
  $db_seeded ||= false
  unless $db_seeded
    #Load the seed forms - Using 'load' method because 'require' will remember that
    #the files was already loaded and for the rest of scenarios will not execute
    #the code in the required file.
    Dir[File.dirname(__FILE__) + '/../../db/forms/*/*.rb'].each {|file| load file }
    Dir[File.dirname(__FILE__) + '/../../db/lookups/*.rb'].each {|file| load file }

    $db_seeded = true
  end

end

Before('@roles') do |scenario|
  #TODO: Instead of the roles below, consider loading db/users/roles.rb
  Role.create(:name => 'Field Worker', :permissions => [Permission::CHILDREN[:register]])
  Role.create(:name => 'Field Admin', :permissions => [Permission::CHILDREN[:view_and_search], Permission::CHILDREN[:create], Permission::CHILDREN[:edit]])
  Role.create(:name => 'Admin', :permissions => Permission.all_permissions)
end

at_exit do
  cleanup_databases
end
