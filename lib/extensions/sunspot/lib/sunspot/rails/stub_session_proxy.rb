module Sunspot
  module Rails
    class StubSessionProxy
      class Search
        def pivot(name)
          PivotStub.new
        end
      end

      class PivotStub
        def rows
          []
        end
      end
    end
  end
end
