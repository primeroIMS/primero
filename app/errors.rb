module Errors
  class ImportError < StandardError; end
  class RevisionNotFoundError < StandardError; end
  class BulkExportNotFound < StandardError; end
end
