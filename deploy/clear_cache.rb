require 'sshkit'
require 'sshkit/dsl'
require 'sshkit/sudo'
include SSHKit::DSL

if ARGV[0] === 'production'
    server = '174.138.108.63'
else
    server = 's3.savetodrive.net'
end   

on ['std_admin@' + server] do |host|
    execute! :sudo, 'rm -rf /tmp/nginx_std_home_page_html/'
end
