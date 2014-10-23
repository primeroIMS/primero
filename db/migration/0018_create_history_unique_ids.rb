Rails.application.eager_load!
CouchRest::Model::Base.descendants.select {|cls| cls.include? Historical }.each do |modelCls|
  puts "Creating unique ids for #{modelCls}'s histories"
  modelCls.all.all.each do |record|
    record.histories.each do |h|
      h.unique_id ||= UUIDTools::UUID.random_create.to_s
    end

    record.database.save_doc(record)
  end
end
