module UploadableFiles

  def uploadable_photo( photo_path = "spec/resources/jorge.jpg" )
    photo = File.new(photo_path)

    def photo.content_type
      "image/#{File.extname( self.path ).gsub( /^\./, '' ).downcase}"
    end

    def photo.size
      File.size self.path
    end

    def photo.original_filename
      self.path.split("/").last
    end

    def photo.data
      File.binread self.path
    end

    photo
  end

  def uploadable_zip_file(zip_path = 'spec/resources/example.csv.zip')
    Rack::Test::UploadedFile.new(Rails.root.join(zip_path))
  end

  def uploadable_executable_file
    executable_file = File.new("spec/resources/exe_file.exe")

    def executable_file.content_type
      "application/x-ms-dos-executable"
    end

    def executable_file.size
      File.size self.path
    end

    def executable_file.original_filename
      self.path
    end

    def executable_file.data
      File.binread self.path
    end

    executable_file
  end

  def uploadable_large_photo
    large_photo = "spec/resources/huge.jpg"
    File.binwrite large_photo, "hello", 50000 * 1024 unless File.exist? large_photo
    uploadable_photo large_photo
  end

  def uploadable_photo_jeff
    uploadable_photo "spec/resources/jeff.png"
  end

  def uploadable_photo_jorge
    uploadable_photo "spec/resources/jorge.jpg"
  end


  def uploadable_photo_gif
    uploadable_photo "spec/resources/small.gif"
  end

  def uploadable_photo_bmp
    uploadable_photo "spec/resources/small.bmp"
  end

  def uploadable_photo_jorge_300x300
    uploadable_photo "spec/resources/jorge-300x300.jpg"
  end

  def no_photo_clip
    uploadable_photo "app/assets/images/no_photo_clip.jpg"
  end

  def uploadable_text_file
    file = File.new("spec/resources/textfile.txt")

    def file.content_type
      "text/txt"
    end

    def file.size
      File.size self.path
    end

    def file.original_filename
      self.path
    end

    file
  end

  def uploadable_audio(audio_path = "spec/resources/sample.amr")

    audio = File.new(audio_path)

    def audio.content_type
      if /amr$/.match self.path
        "audio/amr"
      elsif /wav$/.match self.path
        "audio/wav"
      elsif /ogg$/.match self.path
        "audio/ogg"
      else
        "audio/mpeg"
      end
    end

    def audio.mime_type
      Mime::Type.lookup self.content_type
    end

    def audio.size
      File.size self.path
    end

    def audio.original_filename
      self.path.split("/").last
    end

    def audio.data
      File.binread self.path
    end

    audio
  end

  def uploadable_large_audio
    large_audio = "spec/resources/huge.mp3"
    File.binwrite large_audio, "hello", 50000 * 1024 unless File.exist? large_audio
    uploadable_audio large_audio
  end

  def uploadable_audio_amr
    uploadable_audio "spec/resources/sample.amr"
  end

  def uploadable_audio_wav
    uploadable_audio "spec/resources/sample.wav"
  end

  def uploadable_audio_mp3
    uploadable_audio "spec/resources/sample.mp3"
  end

  def uploadable_audio_ogg
    uploadable_audio "spec/resources/sample.ogg"
  end

  def uploadable_jpg_photo_without_file_extension
    uploadable_photo("spec/resources/jorge_jpg").tap do |photo|
      def photo.content_type
        "image/jpg"
      end
    end
  end
end
