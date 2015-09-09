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
    SystemSettings,
  ]

  def export_bundle
    bundle_data = BUNDLE_MODELS.inject({}) do |acc, modelCls|
      acc.merge({modelCls.name => modelCls.database.all_docs(:include_docs => true)['rows']
                                                   .reject {|r| r['id'].start_with?('_design') }
                                                   .map do |r|
                                                     doc = r['doc'].except('_rev')

                                                     if doc.include?('_attachments')
                                                       doc['_attachments'] = doc['_attachments'].inject({}) do |acc, (name, data)|
                                                         acc.merge(name => {"content_type" => data['content_type'],
                                                                            "data" => Base64.encode64(modelCls.database.fetch_attachment(doc, name))})
                                                       end
                                                     end

                                                     doc
                                                   end})
    end

    encrypt_data_to_zip(JSON.pretty_generate(bundle_data), "configuration-bundle-#{request.host}.json", params[:password])
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
        modelCls.database.recreate!
        begin
          modelCls.design_doc.sync!
        rescue RestClient::ResourceNotFound
          #Mysteriously, the original recreate sometimes breaks.
          Rails.logger.warn "Problem recreating databse #{modelCls.database.name}. Trying again"
          modelCls.database.create!
          modelCls.design_doc.sync!
        end
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
