class ConfigurationBundle < CouchRest::Model::Base
  use_database :configuration_bundle

  include PrimeroModel
  include Memoizable #Nothing to memoize but provides refresh infrastructure

  property :applied_by
  property :applied_at, DateTime, default: DateTime.now

  design do
    view :all
  end

  def self.import(model_data, applied_by=nil)
    Rails.logger.info "Starting configuration bundle import..."

    #TODO: This will throw a NameError if the model doesnt exist
    model_data = model_data.map{|m,d| [m.constantize, d]}.to_h

    Rails.logger.info "Removing the configuration databases"
    model_data.keys.each do |model_clazz|
      model_clazz.database.recreate!
      begin
        model_clazz.design_doc.sync!
      rescue RestClient::ResourceNotFound
        #TODO: CouchDB transactions are asynchronous.
        #      That means that sometimes the server will receive a command to update a database
        #      that has yet to be created. For now this is a hack that should work most of the time.
        #      The real solution is to synchronize on the database creation, and only trigger
        #      the design record sync (and any other updates) when we know the database exists.
        Rails.logger.warn "Problem recreating databse #{model_clazz.database.name}. Trying again"
        model_clazz.database.create!
        model_clazz.design_doc.sync!
      end
    end

    Rails.logger.info "Saving configuration data"
    model_data.each do |model_clazz, data_arr|
      model_clazz.database.bulk_save(data_arr, false, false)
    end

    reset_couch_watcher_sequences

    ConfigurationBundle.create! applied_by: applied_by
    #reset_couch_watcher_sequences
    Rails.logger.info "Successfully completed configuration bundle import."
  end

  def self.export
    bundle_data = {}
    bundle_models.each do |model|
      model_data = model.database.all_docs(include_docs: true)['rows']
        .reject{|r| r['id'].start_with?('_design')}
        .map do |r|
          doc = r['doc'].except('_rev')
          if doc.include?('_attachments')
            doc['_attachments'] = doc['_attachments'].inject({}) do |acc, (name, data)|
              acc.merge(name => {
                "content_type" => data['content_type'],
                "data" => Base64.encode64(model.database.fetch_attachment(doc, name))
              })
            end
          end
          doc
        end
      bundle_data[model.name] = model_data
    end
    bundle_data
  end

  def self.export_as_json
    JSON.pretty_generate(export)
  end

  def self.bundle_models
    [
      Agency, ContactInformation, FormSection, Location, Lookup,
      PrimeroModule, PrimeroProgram, Replication, Report, Role,
      SystemUsers, UserGroup, SystemSettings
    ]
  end


  #Although nothing is truly memoized on this class, changes to this will trigger a refresh
  #of the memoization cache for all metadata-type classes
  def self.memoized_dependencies
    CouchChanges::Processors::Notifier.supported_models
  end

  #Ducktyping to allow refreshing
  def self.flush_cache ; end

  private

  #TODO: The logic of this file belongs in the couchwatcher sequencer. It is currently duplicated in a rake task
  #TODO: The sequence file path should be extranalized into a config file and populated by Chef
  #In production, there is an external file watcher that will bounce the couch water when the sequence file changes
  def self.reset_couch_watcher_sequences
    Rails.logger.info "Resetting the CouchWatcher sequence file"
    latest_sequences = CouchChanges::MODELS_TO_WATCH.inject({}) do |acc, modelCls|
      acc.merge(modelCls.database.name => modelCls.database.info['update_seq'])
    end
    CouchChanges::Sequencer.prime_sequence_numbers(latest_sequences)

    #Restart the couch-watcher to sync it up with the updated Sequence Number History file
    CouchChanges::Watcher::restart
  end

  def self.most_recent
    ConfigurationBundle.all.sort_by{|c| c.applied_at}.last
  end

end