# frozen_string_literal: true

namespace :git do
  desc 'Generate credits file from the github contributors list'
  task :generate_credits do
    write_file("#{Rails.root}/doc/credits", `git shortlog -sne | cut -f2 | sort -t\\< -k2b -u | sort`)
  end
end
def write_file(name, content)
  puts "Writing #{name}..."
  File.write(name, content)
end
