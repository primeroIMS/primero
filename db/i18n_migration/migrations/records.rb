Records = [Child, TracingRequest, Incident];

Records.each do |record_type|
  record_type.all.rows.map {|r| record_type.database.get(r["id"]) }.each do |record|
    binding.pry; x = 0
  end
end
