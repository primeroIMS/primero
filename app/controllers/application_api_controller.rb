class ApplicationApiController < ActionController::API

  before_action :authenticate_user!

  class << self
    attr_accessor :model_class
  end

  def model_class
    self.class.model_class
  end

end