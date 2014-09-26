module ImportActions
  extend ActiveSupport::Concern

  def import_file
    if params[:import_file].is_a? ActionDispatch::Http::UploadedFile
      file = params[:import_file]
      type = params[:import_type] || file.original_filename.split('.')[-1]

      importer = Importers::ACTIVE_IMPORTERS.select {|imp| imp.id == type}.first
      if importer.nil?
        flash[:error] = t('imports.unknown_type')
        redirect_to :action => :index and return
      end

      begin
        handle_import(file.tempfile, importer)
      rescue TypeError => e
        flash[:error] = t("imports.error", error: e)
        redirect_to :action => :index and return
      end

      flash[:notice] = t('imports.successful')
      redirect_to :action => :index
    else
      flash[:error] = t('imports.file_missing')
      redirect_to :action => :index
    end
  end

  def handle_import(upload_file, importer)
    model_data = Array(importer.import(upload_file))

    model_data.map do |d|
      self.model_class.import(d, current_user)
    end.each {|m| m.save! }
  end

end
