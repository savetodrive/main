namespace :staging do
  desc 'Upload robots file'
  task :upload_robots do
    on roles(:app) do
      within release_path do
        upload! 'deploy/staging/robots.txt', 'public/robots.txt'
      end
    end
  end  
end
