class AutoPopulateInformation < ValueObject

  attr_accessor :field_key, :format, :separator, :auto_populated

  def initialize(args={})
    super(args)
    self.auto_populated ||= false
    self.format ||= []
    self.separator ||= ''
  end

end
