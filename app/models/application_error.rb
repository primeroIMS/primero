class ApplicationError < ValueObject

  attr_accessor :code, :message, :resource, :detail

end