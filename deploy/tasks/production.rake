namespace :production do
  desc 'Upload robots file'
  task :upload_robots do
    on roles(:all) do
      within release_path do
        upload! 'deploy/production/robots.txt', 'public/robots.txt'
      end
    end
  end
end
