#Class for allowing Sunspot to hook into CouchDB and pull back the entire CouchDB document
class DocumentInstanceAccessor < Sunspot::Adapters::InstanceAdapter
  def id
    @instance.id
  end
end

#Class for allowing Sunspot to hook into CouchDB and pull back the entire CouchDB document
class DocumentDataAccessor < Sunspot::Adapters::DataAccessor
  def load(id)
    @clazz.get(id)
  end

  def load_all(ids)
    @clazz.all(:keys => ids).all
  end
end