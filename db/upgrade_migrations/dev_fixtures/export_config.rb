# This mimics the logic in the export rake task:  rake db:data:export_config_bundle[json_file]
# That rake task exists in later Primero versions, but not in 1.3
# Copy to the application directory where you want to do the export
#
# Usage:          bundle exec rails r export_config.rb > <config_file_name>.json
#
# Example Usage:  RAILS_ENV=production bundle exec rails r export_config.rb > config_jo_20200526.json

require 'json'
def export
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

def export_as_json
  JSON.pretty_generate(export)
end

def bundle_models
  [
    Agency, ContactInformation, FormSection, Location, Lookup,
    PrimeroModule, PrimeroProgram, Replication, Report, Role,
    SystemUsers, UserGroup, SystemSettings
  ]
end


#####################
# Beginning of script
#####################
bundle_json = export_as_json
puts bundle_json
