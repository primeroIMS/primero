# frozen_string_literal: true

# Retrieves a list of record histories by type
class ActivityLog
  TYPE_TRANSFER = 'transfer'

  class << self
    def list(user, type)
      return RecordHistory.none unless type == TYPE_TRANSFER

      TransferActivityService.list(user)
    end
  end
end
