require 'rake'

puts 'Cleaning up (Destroying/Indexing Solr)'

app = Rake.application
app.init
app.add_import File.join(Rails.root, 'lib/tasks/sunspot.rake') 
app.load_rakefile

Rake::Task['sunspot:remove_all'].invoke()
Rake::Task['sunspot:reindex'].invoke()
