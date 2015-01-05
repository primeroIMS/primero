# This is a singleton class that encapsulates the RJB-loadaded Apache POI library.
# Refer to this for how to use Apache POI via RJB: https://gist.github.com/chsh/54549
class Poi
  include Singleton

  class << self
    attr_accessor :java_params
    attr_accessor :apache_poi_path
  end

  def initialize
    @java_params = Poi.java_params || ["-Xmx512M"]
    apache_poi_path = Poi.apache_poi_path || Rails.root.join("apache_poi", "poi-3.10.1-20140818.jar").to_s
    @poi ||= Rjb::load(apache_poi_path, @java_params)
    @fis_class ||= Rjb::import("java.io.FileInputStream")
    @byteos_class ||= Rjb::import("java.io.ByteArrayOutputStream")
    @poifs_class ||= Rjb::import("org.apache.poi.poifs.filesystem.POIFSFileSystem")
    @hssfwb_class ||= Rjb::import("org.apache.poi.hssf.usermodel.HSSFWorkbook")
  end

  #TODO: Define new workbook instantiation methods
  def open_workbook_from_template(template_path)
    #incident_report_template = Rails.root.join("incident_report_template", "IRv66_Blank-MARA.xls").to_s
    template_file = @fis_class.new(template_path)

    begin
      #if success, will close the InputStream.
      poifs = @poifs_class.new(template_file)
    rescue Exception => e
      Rails.logger.error("#{e}: #{e.backtrace}")
      raise e
    ensure
      #make sure to close the InputStream.
      template_file.close
    end

    @hssfwb_class.new(poifs)
  end

  def workbook_to_string(workbook)
    byteos = @byteos_class.new
    workbook.write(byteos)
    io = StringIO.new byteos.toByteArray
    io.string
  end

end
