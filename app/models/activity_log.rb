# frozen_string_literal: true

# Retrieves a list of record histories by type
class ActivityLog
  TYPE_TRANSFER = 'transfer'

  class << self
    def list(user, params)
      TransferActivityService.list(user, params)
    end
  end
end
