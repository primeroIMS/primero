module SunspotHelper
  def indexed_field(value, klass=nil)
    Sunspot::Type.for_class(klass || value.class).to_indexed(value)
  end
end
