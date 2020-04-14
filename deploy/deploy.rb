set :application, 'savetodrive'
set :repo_url, 'git@bitbucket.org:savetodrive/savetodrive.git'

set :deploy_to, '/home/savetodrive/webapp'

# Default branch is :master
set :branch, ENV['branch'] || 'master'

# Whether to restart the application or to gracefully reload the app
# default is false which means the application is gracefully reloaded
set :restart, ENV['restart'] || 'false'

set :format_options, command_output: true, log_file: 'storage/logs/capistrano.log', color: :auto, truncate: :auto

# Default value for keep_releases is 5
set :keep_releases, 3
set :ssh_options, { :forward_agent => true }

#set :linked_files, ['config.js']

set :linked_dirs, ['storage/logs']

set :filter, :roles => %w{app}

namespace :deploy do
  after :updated, "env:create"
  after :updated, "yarn:install"
  after :updated, "subscription:copy_key"

  after :publishing, "pm2:upload_conf"
  after :published, "pm2:start"

  #after :finished, "notify:finish"

  #after :failed, "notify:failure"
end
