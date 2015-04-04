class ApiConstraints
  def initialize(options)
    @version = options[:version]
    @default = options[:default]
  end

  # Rails router triggers this for scope constraints
  def matches?(req)
    @default || req.headers['Accept'].include?("application/json.v#{@version}")
  end
end