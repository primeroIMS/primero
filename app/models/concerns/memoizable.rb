module Memoizable
  extend ActiveSupport::Concern

  included do
    class << self
      extend Memoist
    end

    def self.handle_changes(id, deleted)
      require 'pry'; binding.pry
      Rails.logger.debug("Flushing memoization cache due to change on #{self.name}")
      flush_cache
    end

    extend Observable
    add_observer(self, :handle_changes)
  end
end
