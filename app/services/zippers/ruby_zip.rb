# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# The default zip. Insecure encryption, but mitigates casual snooping.
class Zippers::RubyZip
  def zip(file, password)
    return unless file && File.size?(file) && password

    encrypt = Zip::TraditionalEncrypter.new(password)
    Zip::OutputStream.open(zipped_file_name(file), encrypt) do |out|
      out.put_next_entry(File.basename(file))
      out.write File.read(file)
    end
    File.delete(file) && zipped_file_name(file)
  end

  def zipped_file_name(file_name)
    "#{file_name}.zip"
  end
end
