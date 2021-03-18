RSpec::Matchers.define :make_queries do |expected|

  match do |block|
    count_queries(&block) == expected
  end

  def count_queries(&block)
    @analyser = QueryAnalyser.new
    ActiveSupport::Notifications
      .subscribed(@analyser.to_proc, 'sql.active_record', &block)
    @analyser.query_count
  end

  failure_message_for_should do |actual|
    <<~MESSAGE
      Expected to run exactly #{expected} queries but ran #{@analyser.query_count}.
      
      Queries Ran:
        #{@analyser.queries.map { |q| "#{q[:name]}: #{q[:sql]}" }.join("\n\n  ")}

    MESSAGE
  end

  class QueryAnalyser
    def initialize
      @queries = []
    end

    def call(name, start, finish, message_id, values)
      @queries << values
    end

    def to_proc
      method(:call)
    end

    def query_count
      @queries.count { |q| ['CACHE', 'SCHEMA'].exclude?(q[:name]) }
    end

    def queries
      @queries
    end
  end

  def supports_block_expectations?
    true
  end
end
