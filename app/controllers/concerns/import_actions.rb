module ImportActions
  extend ActiveSupport::Concern

  ACTIVE_IMPORTERS = [
    Importers::CSVImporter, Importers::ExcelImporter, Importers::JSONImporter
  ].freeze

  def import_file
    authorize! :import, model_class

    if params[:import_file].is_a? ActionDispatch::Http::UploadedFile
      file = params[:import_file]
      type = params[:import_type] || file.original_filename.split('.')[-1]

      file_extension = file.original_filename.split('.').pop
      password = params[:password]

      begin
        # If the uploaded file is a zip file try to open it and process the content file(s)
        if file_extension.downcase == "zip"
          success, message = import_zip_file(file.tempfile.path, password, type)

          if !success
            flash[:error] = message
            redirect_to :action => :index and return
          end
        else
          if !import_single_file(file.tempfile.open, type)
            flash[:error] = t('imports.unknown_type')
            redirect_to :action => :index and return
          end
        end
      rescue TypeError => e
        flash[:error] = t("imports.error", error: e)
        redirect_to :action => :index and return
      rescue Exception => ex
        flash[:error] = I18n.t("imports.error", error: ex.message)
        redirect_to :action => :index and return
      end
      flash[:notice] = t('imports.successful')
      redirect_to :action => :index
    else
      flash[:error] = t('imports.file_missing')
      redirect_to :action => :index
    end
  end

  def import_zip_file zip_file, password, type
    decrypter = password.present? ? Zip::TraditionalDecrypter.new(password) : nil?

    Zip::InputStream.open(zip_file, 0, decrypter) do |io|
      while (file = io.get_next_entry)
        unless io.eof
          begin
            name = file.name
            ext = type == 'guess' ? name.split('.').pop : type
            temp_file = StringIO.new io.read
          rescue
            return [false, I18n.t("imports.decrypt_error")]
          end

          def temp_file.open(*mode, &block)
            self.rewind
            block.call(self) if block
            return self
          end

          if !import_single_file(temp_file, ext)
            return [false, t('imports.zip_file.unknown_type')]
          end
        end
      end

      [true, '']
    end
  end

  def import_single_file file, type
    importer = ACTIVE_IMPORTERS.select {|imp| imp.id == type}.first
    return false if importer.nil?

    handle_import(file, importer)
    true
  end

  def handle_import(upload_file, importer)
    model_data = Array(importer.import(upload_file))

    model_data.map do |d|
      self.model_class.import(d, current_user)
    end.each {|m| m.save! }
  end

end
