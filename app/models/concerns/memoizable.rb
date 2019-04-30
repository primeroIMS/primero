# This module will make class methods memoizable in production by specifying
# `memoize_in_prod :<method_name>` after the method definition.  It will also
# make the class observable and create a default observer on itself that
# flushes the memoization cache for all memoized methods on any changes.
# require 'observer'

module Memoizable
  extend ActiveSupport::Concern

  included do
    # class << self
    #   def self.memoize_in_prod(*args)
    #     if Rails.env == 'production'
    #       memoize(*args)
    #     else
    #       #bump up the arity of the class methods in dev.
    #       args.each do |method|
    #         aliased_method = "#{method}_devaliased".to_sym
    #         if self.instance_methods.include? method
    #           arity = self.instance_method(method).arity
    #           self.send(:alias_method, aliased_method, method)
    #           self.class_eval <<-EOS
    #             def #{method}(*args)
    #               arity = #{arity}
    #               if arity == 0
    #                 args = []
    #               elsif arity > 0
    #                 args = args[0..(arity-1)]
    #               elsif arity < 0 && args.last.is_a?(TrueClass)
    #                 args = args[0..-2]
    #               end
    #               #{aliased_method}(*args)
    #             end
    #             private :#{aliased_method}
    #           EOS
    #         end
    #       end
    #     end
    #   end

    #   extend Memoist
    end

    # def self.handle_changes(*args)
    #   Rails.logger.info("Flushing memoization cache due to change on #{self.name}")
    #   flush_dependencies
    # end

    # def self.flush_dependencies
    #   flush_cache
    #   memoized_dependencies.each do |dependency_class|
    #     Rails.logger.info("Flushing memoization cache for #{dependency_class.name} due to change on #{self.name}")
    #     dependency_class.flush_cache
    #   end
    # end

    # # Override this when we want to flush additional classes
    # def self.memoized_dependencies
    #   return []
    # end

    # extend Observable
    # add_observer(self, :handle_changes)
  # end
end
