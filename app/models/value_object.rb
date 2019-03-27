class ValueObject

  def initialize(args={})
    args.each{|k,v| self.send("#{k}=",v) if self.respond_to?("#{k}=")}
  end

  def to_h
    self.instance_variables.map do |var|
      [var.to_s.delete("@"), instance_variable_get(var)]
    end.to_h
  end

end