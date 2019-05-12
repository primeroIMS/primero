class ApplicationError < ValueObject

  attr_accessor :code, :message, :resource, :exception

end