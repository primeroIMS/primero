# This module will make class methods memoizable in production by specifying
# `memoize_in_prod :<method_name>` after the method definition.  It will also
# make the class observable and create a default observer on itself that
# flushes the memoization cache for all memoized methods on any changes.
module Memoizable
  extend ActiveSupport::Concern

  included do
    class << self
      def self.memoize_in_prod(*args)
        if Rails.env == 'production'
          memoize(*args)
        end
      end

      extend Memoist
    end

    def self.handle_changes(*args)
      Rails.logger.debug("Flushing memoization cache due to change on #{self.name}")
      flush_cache
    end

    extend Observable
    add_observer(self, :handle_changes)
  end
end
