# frozen_string_literal: true

# Let's not bother zipping and faux-encrypting our exports
class Zippers::NoZip
  def zip(file, _password)
    file
  end
end