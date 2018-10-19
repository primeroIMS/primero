class OptionsQueueStats
  def self.options_not_generated?
    options_dir = "#{Rails.root}/public/options"

    File.directory?(options_dir) && Dir.empty?(options_dir) ||
      !File.directory?(options_dir)
  end

  def self.jobs?
    job_count = 0

    if Rails.env.production?
      begin
        conn = Backburner::Connection.new(Backburner.configuration.beanstalk_url)
        tube = conn.tubes["#{Rails.env}_options"]
        job_count = tube.stats.current_jobs_ready if tube.present? && tube.stats.present?
      rescue Beaneater::NotFoundError
        Rails.logger.error 'Unable to find queue tube'
      end
    elsif Rails.env.test?
      # Skip job if in test env
      job_count = 1
    end

    job_count.positive?
  end
end
