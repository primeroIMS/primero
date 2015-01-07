class ConfigurationBundleController < ApplicationController
  BUNDLE_MODELS = [
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
      acc.merge({modelCls.name => modelCls.all.map {|m| m.to_hash.except('_rev')}})
    end

    encrypt_data_to_zip(bundle_data.to_json, "configuration-bundle-#{request.host}.json", params[:password])
  end

  def import_bundle
    file = params[:import_file]
    model_data = Importers::JSONImporter.import(params[:import_file])

    Rails.logger.info "Starting configuration bundle import..."
    model_data.map do |model_name, data_arr|
      begin
        modelCls = model_name.constantize
        data_arr.each do |d|
          if d['_id']
            existing = modelCls.get_unique_instance(d) || modelCls.get(d['_id'])
            if existing
              Rails.logger.info "Deleting exisitng #{modelCls.name} prior to bundle import for id #{d['_id']}"
              existing.destroy
            end
          end

          modelCls.import(d, current_user).save!
        end
      rescue NameError => e
        Rails.logger.error "Invalid model name in bundle import: #{model_name}"
        flash[:error] = "Invalid model name #{model_name}"
        redirect_to :action => :index, :controller => :users and return
      end
    end

    Rails.logger.info "Successfully completed configuration bundle import."
    # TODO: modify the redirect if this ever gets it own page
    flash[:notice] = t('imports.successful')
    redirect_to :action => :index, :controller => :users and return
  end
end
