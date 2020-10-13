module KPI
  class ClientFeedbackResponseList < ValueObject
    attr_accessor :responses

    def wrapped_responses
      @wrapped_responses ||= responses
        .map { |response| ClientFeedbackResponse.new(response: response) }
    end

    def satisfied
      wrapped_responses.count(&:satisfied?)
    end

    def unsatisfied
      wrapped_responses.count { |response| !response.satisfied? }
    end
  end
end
