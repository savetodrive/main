server 's3.savetodrive.net',
    roles: %w{app},
    user: 'savetodrive',
    port: 22,
    primary: true
    
set :stage, :staging

namespace :deploy do
    after :publishing, "staging:upload_robots"
end
