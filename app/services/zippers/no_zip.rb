# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# Let's not bother zipping and faux-encrypting our exports
class Zippers::NoZip
  def zip(file, _password)
    file
  end
end
