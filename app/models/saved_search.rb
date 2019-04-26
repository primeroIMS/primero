class SavedSearch < ApplicationRecord
  def add_filter(name, filter)
    if self.filters.present?
      self.filters[name] = filter
    else
      self.filters = { name => filter }
    end
  end
end
