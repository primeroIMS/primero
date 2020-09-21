module KPI
  SearchValue = Struct.new(:from, :to)

  class Search < SearchValue
    def self.search_model(model = nil)
      @search_model ||= model
    end

    def search_model
      self.class.search_model
    end
  end
end
