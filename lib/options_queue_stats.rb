class OptionsQueueStats
  def self.jobs?
    job_count = 0

    if Rails.env.production?
      begin
        conn = Backburner::Connection.new(Backburner.configuration.beanstalk_url)
        tube = conn.tubes["#{Rails.env}_options"]
        job_count = tube.stats.try(:current_jobs_ready) if tube.present? && tube.stats.present?
      rescue Beaneater::NotFoundError
        Rails.logger.error 'Unable to find queue tube'
      end
    end

    job_count.positive?
  end
end
