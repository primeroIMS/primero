module Memoizable
  extend ActiveSupport::Concern

  include Observable

  def included
    extend Memoist

    add_observer(self, :handle_changes)

    def handle_changes(id, deleted)
      flush_cache
    end
  end
end
