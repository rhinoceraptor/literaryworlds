#!/bin/sh

export DOLLAR='$'
envsubst < /configs/nginx.conf.template > /etc/nginx/nginx.conf
nginx -g "daemon off;"

