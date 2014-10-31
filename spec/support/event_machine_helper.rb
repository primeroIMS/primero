
module EventMachineHelper
  def check_mocks
    EM.add_periodic_timer(0.1) do
      begin
        RSpec::Mocks.space.proxies.each_value do |obj|
          obj.instance_eval { method_doubles.each {|d| d.verify} }
        end
      rescue RSpec::Mocks::MockExpectationError
        nil
      else
        EM.stop
      end
    end

    EM.add_timer(5) do
      EM.stop
    end
  end
end
