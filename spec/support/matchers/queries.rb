# frozen_string_literal: true

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

  failure_message do
    <<~MESSAGE
      Expected to run exactly #{expected} queries but ran #{@analyser.query_count}.

      Queries Ran:
        #{@analyser.queries.map { |q| "#{q[:name]}: #{q[:sql]}" }.join("\n\n  ")}

    MESSAGE
  end

  class QueryAnalyser
    attr_accessor :queries

    def initialize
      @queries = []
    end

    def call(_name, _start, _finish, _message_id, values)
      @queries << values
    end

    def to_proc
      method(:call)
    end

    def query_count
      @queries.count { |q| %w[CACHE SCHEMA].exclude?(q[:name]) }
    end
  end

  def supports_block_expectations?
    true
  end
end
