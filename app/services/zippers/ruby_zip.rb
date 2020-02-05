# frozen_string_literal: true

# The default zip. Insecure encryption, but mitigates casual snooping.
class Zippers::RubyZip
  def zip(file, password)
    return unless file && File.size?(file) && password

    encrypt = Zip::TraditionalEncrypter.new(password)
    Zip::OutputStream.open(zipped_file_name(file), encrypt) do |out|
      out.put_next_entry(File.basename(stored_file_name))
      out.write File.open(file).read
    end
    File.delete(file) && zipped_file_name(file)
  end

  def zipped_file_name(file_name)
    "#{file_name}.zip"
  end
end