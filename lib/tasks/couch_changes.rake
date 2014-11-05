
namespace :couch_changes do
  desc "Generate the most up to date sequence numbers for the CouchDB watcher process"
  task :prime_sequence_numbers, [:output_file] => :environment do |t, args|
    latest_sequences = CouchChanges::MODELS_TO_WATCH.inject({}) do |acc, modelCls|
      acc.merge(modelCls.database.name => modelCls.database.info['update_seq'])
    end
    CouchChanges::Sequencer.prime_sequence_numbers(latest_sequences, args[:output_file])
  end
end
