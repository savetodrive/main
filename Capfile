set :deploy_config_path, 'deploy/deploy.rb'
set :stage_config_path, 'deploy/stages'

require "capistrano/setup"
require "capistrano/deploy"
#require 'sshkit/sudo'

require "capistrano/scm/git"
install_plugin Capistrano::SCM::Git

# Load custom tasks from `deploy/tasks/tasks` if you have any defined
Dir.glob('deploy/tasks/*.rake').each { |r| import r }
