module Errors
  class ImportError < StandardError; end
  class BulkExportNotFound < StandardError; end
  class ForbiddenOperation < StandardError; end
end
