class ApplicationApiController < ActionController::API

  class << self
    attr_accessor :model_class
  end

  def model_class
    self.class.model_class
  end

end