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
      acc.merge({modelCls.name => modelCls.database.all_docs(:include_docs => true)['rows']
                                                   .reject {|r| r['id'].start_with?('_design') }
                                                   .map {|m| m['doc'].except('_rev') }})
    end

    encrypt_data_to_zip(bundle_data.to_json, "configuration-bundle-#{request.host}.json", params[:password])
  end

  def import_bundle
    file = params[:import_file]
    if file.nil?
      flash[:error] = "Please specify a file to import!"
      redirect_to :action => :index, :controller => :users and return
    end
    model_data = Importers::JSONImporter.import(params[:import_file])

    Rails.logger.info "Starting configuration bundle import..."
    model_data.map do |model_name, data_arr|
      begin
        modelCls = model_name.constantize
        models_to_delete = []
        data_arr.each do |d|
          if d['_id']
            existing = modelCls.get_unique_instance(d) || modelCls.get(d['_id'])
            if existing
              Rails.logger.info "Marking for deletion exisitng #{modelCls.name} prior to bundle import for id #{d['_id']}"
              models_to_delete << existing
            end
          end
        end
        # The first bulk save deletes existing models, the second recreates
        # them from the bundle
        modelCls.database.bulk_save(models_to_delete.map {|m| {'_id' => m.id, '_rev' => m.rev, :_deleted => true} })
        modelCls.database.bulk_save(data_arr, false, false)
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
