[Child, Incident, TracingRequest].each do |model|
  model.all.all.each do |record|
    # Get rid of the old way of tracking updates
    record.delete 'updated_fields'

    last_hist = record['histories'].last.clone

    record.histories.clear
    record.histories << {
      :user_name => last_hist['user_name'],
      :action => :create,
      :datetime => last_hist['datetime'],
      :changes => {},
      :prev_revision => nil,
    }

    record.save!
  end
end
