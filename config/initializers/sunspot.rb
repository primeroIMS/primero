# ensure that sunpot is loaded
require 'sunspot'

Dir.glob(Rails.root.join('lib', 'extensions', 'sunspot', '**', '*.rb')).each do |file|
  require file
end
