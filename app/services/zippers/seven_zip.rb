# frozen_string_literal: true

require 'English'

# Wrapper for the p7zip library. Generates
# The only secure option.
class Zippers::SevenZip
  def zip(_file, _password)
    raise NotImplementedError
  end

  protected

  def run_7za(*cmd)
    check_7za!
    io = IO.popen(cmd)
    Process.wait(io.pid)
    io.close
    raise "Error while zipping #{file}" unless $CHILD_STATUS.success?
  end

  def check_7za!
    raise 'Make sure that the executable 7za is in your PATH!' unless `which 7za`.present?
  end

  def zipped_file_name(file_name)
    "#{file_name}.#{suffix}"
  end
end