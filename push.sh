#Semplice script per pushare questo progetto nella cartella httdocs di apache

#! /bin/bash

path=/opt/lampp/htdocs
except=appunti
'sudo cp -r !('$except') '$path
