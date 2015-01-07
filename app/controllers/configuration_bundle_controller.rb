class ConfigurationBundleController < ApplicationController
  BUNDLE_MODELS = [
    User,
    Agency,
    ContactInformation,
    FormSection,
    Location,
    Lookup,
    PrimeroModule,
    PrimeroProgram,
    Replication,
    Report,
    Role,
    SystemUsers,
    UserGroup,
  ]

  def export_bundle
    bundle_data = BUNDLE_MODELS.inject({}) do |acc, modelCls|
      acc.merge({modelCls.name => modelCls.all.map(&:to_hash)})
    end

    encrypt_data_to_zip(bundle_data.to_json, "configuration-bundle-#{request.host}.json.zip", params[:password])
  end

  def import_bundle
    file = params[:import_file]
    model_data = JSONImporter.import(import_file)

    model_data.map do |model_name, data_arr|
      begin
        modelCls = model_name.constantize
        data_arr.each do |d|
          if d['_id']
            existing = modelCls.get(d['_id'])
            if existing
              Rails.log.info "Deleting exisitng #{modelCls.name} prior to bundle import for id #{d['_id']}"
              existing.destroy
            end
          end

          modelCls.import(d, current_user).save!
        end
      rescue NameError => e
        Rails.log.error "Invalid model name in bundle import: #{model_name}"
        render :text => "Invalid model name #{model_name}", :status => :unprocessable_entity } and return
      end
    end
  end
end
