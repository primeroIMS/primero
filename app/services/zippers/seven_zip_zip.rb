# frozen_string_literal: true

# Uses 7zip to create an AES256 encrypted, Zip-encoded archive.
# Actually secure, but no one supports this.
class Zippers::SevenZipZip < Zippers::SevenZip
  def zip(file, password)
    run_7za['7za', 'a', '-tzip', '-mem=AES256', "-p#{password}", zipped_file_name(file), file]
    File.delete(file) && zipped_file_name(file)
  end

  def suffix
    'zip'
  end
end