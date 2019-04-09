class Mapping < ValueObject

  attr_accessor :mapping, :autocalculate

  def initialize(args={})
    super(args)
    self.mapping ||= {}
    self.autocalculate ||= false
  end

end
