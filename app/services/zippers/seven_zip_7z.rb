# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# Uses 7zip to create an AES256 encrypted, 7z-encoded archive.
# Actually secure, but no one supports this.
class Zippers::SevenZip7z < Zippers::SevenZip
  def zip(file, password)
    run_7za['7za', 'a', '-t7z', "-p#{password}", zipped_file_name(file), file]
    File.delete(file) && zipped_file_name(file)
  end

  def suffix
    '7z'
  end
end
