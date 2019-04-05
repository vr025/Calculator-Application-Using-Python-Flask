# Calculator Application
A simple calculator made with Flask (python) on server side and HTML, CSS, JavaScript(Jquery) on client side.
It has a python setup with a wsgi server which is hosted behind Apache.
The site is enabled with self-signed HTTPS connection.

## DEMO
https://ec2-3-17-141-79.us-east-2.compute.amazonaws.com/


## Versions
Flask==1.0.2  
Jinja2==2.10
Werkzeug==0.14.1

## How to use the Application

1. There is no prerequisite needed to run this project. All we need is a brower to access the URL given in demo
2. Initially after loading the URL, a "Try it" page appears. After clicking the "Try it", it will redirect to the application page
3. In the application page, A calculator model will appears
4. All basic calculator operations can be done on this application.
5. Click first number on the calculator and a operand. Then click the second number. These two numbers and the operand will be sent to the server in JSON format through AJAX calls.
6. In the server, these two numbers will be processed based on the entered operator and returns the result to the application in JSON format. 
7. The application will display the JSON result in a user readable format.

## Installation of Flask and application

use `pip` to install requirements：  

1. sudo apt-get install python-pip

2. sudo pip install Flask

3. In the AWS console create an inbound rule with port 80 accessible from anywhere for your instance.

4. Then install the apache webserver and mod_wsgi using the below commands 

		sudo apt-get update
		sudo apt-get install apache2
		sudo apt-get install libapache2-mod-wsgi

5. Create a directory called "calculator" in var/www/html, and copy paste the entire contents from the github into that directory.  

## WSGI Configuration

6. In the github repository, there is calc.wsgi file. This is used to load the app.

7. In the apache configuration file located at /etc/apache2/sites-enabled/000-default.conf, add the following block just after the DocumentRoot /var/www/html line

		WSGIDaemonProcess calculator threads=5
		WSGIScriptAlias / /var/www/html/calculator/calcapp.wsgi

		<Directory calculator>
		    WSGIProcessGroup calculator
		    WSGIApplicationGroup %{GLOBAL}
		    Order deny,allow
		    Allow from all
		</Directory>

8. Now restart the server using the below command.

		sudo apachectl restart

9. Go to http://ec2-3-17-141-79.us-east-2.compute.amazonaws.com/ . The website will now work in HTTP mode.

Reference blog : https://www.datasciencebytes.com/bytes/2015/02/24/running-a-flask-app-on-aws-ec2/

## HTTPS configuration

1. Use the below OpenSSL command to create a SSL certificate. This is a self-signed certificate

		sudo openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout /etc/ssl/private/apache-selfsigned.key -out /etc/ssl/certs/apache-selfsigned.crt

2. Fill out the prompts appropriately. The most important line is the one that requests the Common Name (e.g. server FQDN or YOUR name). You need to enter the domain name associated with your server or, more likely, your server's public IP address.

3. The next step is to create a strong Diffie-Hellman group. Use the below command to achieve this step

		sudo openssl dhparam -out /etc/ssl/certs/dhparam.pem 2048

4. Create an Apache configuration Snippet by copy pasting the below lines in the file "/etc/apache2/conf-available/ssl-params.conf"


		SSLCipherSuite EECDH+AESGCM:EDH+AESGCM:AES256+EECDH:AES256+EDH
		SSLProtocol All -SSLv2 -SSLv3
		SSLHonorCipherOrder On

		#Header always set Strict-Transport-Security "max-age=63072000; includeSubdomains; preload"
		Header always set Strict-Transport-Security "max-age=63072000; includeSubdomains"
		Header always set X-Frame-Options DENY
		Header always set X-Content-Type-Options nosniff

		SSLCompression off 
		SSLSessionTickets Off
		SSLUseStapling on 
		SSLStaplingCache "shmcb:logs/stapling-cache(150000)"

		SSLOpenSSLConfCmd DHParameters "/etc/ssl/certs/dhparam.pem"

5. Add/Modify the below lines in the SSL configuration "sudo nano /etc/apache2/sites-available/default-ssl.conf"

		 <VirtualHost _default_:443>
		        ServerAdmin your_email@example.com
			ServerName ec2-3-17-141-79.us-east-2.compute.amazonaws.com:443
			DocumentRoot /var/www/html
		 
		 WSGIScriptAlias / /var/www/html/calculator/calcapp.wsgi

		<Directory calculator>
		    WSGIProcessGroup calculator
		    WSGIApplicationGroup %{GLOBAL}
		    Order deny,allow
		    Allow from all
		 </Directory>

		.............

		  SSLCertificateFile      /etc/ssl/certs/apache-selfsigned.crt
		  SSLCertificateKeyFile /etc/ssl/private/apache-selfsigned.key

		 ..............

		  BrowserMatch "MSIE [2-6]" \
		  nokeepalive ssl-unclean-shutdown \
		  downgrade-1.0 force-response-1.0
	
6. Add a redirect property in the HTTP module on the file "sudo nano /etc/apache2/sites-available/000-default.conf"

		<VirtualHost *:80>

		ServerAdmin webmaster@localhost
		DocumentRoot /var/www/html/

		Redirect  "/" "https://ec2-3-17-141-79.us-east-2.compute.amazonaws.com/"

		WSGIDaemonProcess calculator threads=5
		WSGIScriptAlias / /var/www/html/calculator/calcapp.wsgi

		<Directory calculator>
		    WSGIProcessGroup calculator
		    WSGIApplicationGroup %{GLOBAL}
		    Order deny,allow
		    Allow from all
		</Directory>

		 ............

		 </VirtualHost>

 7. Now enable the SSL and headers modules in Apache, enable the SSL-ready Virtual Host, and restart Apache.
 
		sudo a2enmod ssl
		sudo a2enmod headers
		sudo a2ensite default-ssl
		sudo a2enconf ssl-params
		sudo apache2ctl configtest
		sudo systemctl restart apache2

8. In the AWS console create an inbound rule with port 443 accessible from anywhere for your instance. 

9. Now go to https://ec2-3-17-141-79.us-east-2.compute.amazonaws.com/ . The website will now work in HTTPS mode.

Reference Blog : https://www.digitalocean.com/community/tutorials/how-to-create-a-self-signed-ssl-certificate-for-apache-in-ubuntu-16-04
 
