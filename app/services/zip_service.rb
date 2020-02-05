# frozen_string_literal: true

# Zip and encrypt a file with a system configured zipper
class ZipService
  def self.zip(file, password)
    zipper.zip(file, password)
  end

  def self.zipper
    case ENV['PRIMERO_ZIP_FORMAT']
    when '7z' then Zippers::SevenZip7z
    when 'zip7z' then Zippers::SevenZipZip
    when 'zip' then Zippers::RubyZip
    else
      Zippers::NoZip
    end.new
  end
end