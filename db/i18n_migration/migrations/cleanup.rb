# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

require 'rake'

puts 'Cleaning up (Destroying/Indexing Solr)'

app = Rake.application
app.init
app.add_import File.join(Rails.root, 'lib/tasks/sunspot.rake')
app.load_rakefile

Rake::Task['sunspot:remove_all'].invoke
Rake::Task['sunspot:reindex'].invoke
