#!/bin/sh

# Adapted from https://gist.github.com/automata/a790205175a37a036feeb9e479322858

appName=$1
# the second parameter for process type defaults to web
processType=${2:-web}

imageId=$(docker inspect registry.heroku.com/$appName/$processType --format={{.Id}})
echo 'Image id for' $appName 'app and' $processType 'process type is' $imageId

payload='{"updates":[{"type":"'$processType'","docker_image":"'$imageId'"}]}'

curl -n -X PATCH https://api.heroku.com/apps/$appName/formation \
-d "$payload" \
-H "Content-Type: application/json" \
-H "Accept: application/vnd.heroku+json; version=3.docker-releases" \
-H "Authorization: Bearer $HEROKU_AUTH_TOKEN"
