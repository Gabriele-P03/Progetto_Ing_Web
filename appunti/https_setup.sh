#Questo vuole essere uno script per generare il certificato - e installarlo - al fine fi abilitare https
#https è necessario al fine della lettura su smartphone dell'iframe!!!
#https://stackoverflow.com/questions/45117519/iframes-not-loading-on-mobile-or-tablet
#https://inchoo.net/dev-talk/how-to-setup-http-protocol-with-ssl-on-lamp-environment/

mkdir ssl
cd ssl
echo "Generando la chiave privata RSA e cifrandola con aes256..."
openssl genrsa -aes256 -out pass.key 2048
echo "Convertendo la chiave RSA..."
openssl rsa -in pass.key -out pass_out.key
echo "Generando il certificato a partire dalla chiave secondo le config di lampp"
openssl req -new -x509 -nodes -sha1 -key pass_out.key -out pass_out.crt -days 999 -config /opt/lampp/share/openssl/openssl.cnf
echo "Copiando la chiave e il certificato..."
sudo cp pass_out.key /opt/lampp/etc/ssl.key
sudo cp pass_out.crt /opt/lampp/etc/ssl.crt
echo "Rimuovendo la chiave e il certificato..."
sudo rm pass_out.key
sudo rm pass_out.crt
cd ..
sudo rm -r ssl

sudo echo -e  \
"DocumentRoot /opt/lampp/htdocs/" \
"ServerName pizzeria:443" \
"ServerAdmin gabriele@pizzeria" \
"ErrorLog /opt/lampp/logs/error_log" \
"TransferLog /opt/lampp/logs/access_log" \
"SetEnv APPLICATION_ENV development" \
"SSLEngine on" \
"SSLCipherSuite ALL:!ADH:!EXPORT56:RC4+RSA:+HIGH:+MEDIUM:+LOW:+SSLv2:+EXP:+eNULL" \
"SSLCertificateFile /opt/lampp/etc/ssl.crt/pass_key.crt" \
"SSLCertificateKeyFile /opt/lampp/etc/ssl.key/pass_key.key" \
"<filesmatch \".(cgi|shtml|phtml|php)$\">" \
"SSLOptions +StdEnvVars" \
"<directory \"/oursite/project/root/directory\">" \
"SSLOptions +StdEnvVars" \
"Options Indexes FollowSymLinks MultiViews" \
"AllowOverride All" \
"Order allow,deny" \
"allow from all" \
"BrowserMatch \".*MSIE.*\"" \
"nokeepalive ssl-unclean-shutdown" \
"downgrade-1.0 force-response-1.0" \
"CustomLog /opt/lampp/logs/ssl_request_log" \
"\"%t %h %{SSL_PROTOCOL}x %{SSL_CIPHER}x \"%r\" %b\" " >> /opt/lampp/etc/extra/httpd-ssl.conf

sudo echo -e "127.0.0.1 pizzeria" >> /etc/hosts
sudo /opt/lampp/lampp restart