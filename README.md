# Literary Worlds Docker

## About
This repository contains a docker compose setup that can run LambdaMOO with an
enCore database, ready for modern web browsers. The enCore Java text interface
has been replaced with a Node.js proxy server that translates websockets to the
raw TCP connection. Additionally, the enCore static content, dynamic web
content, and the Node.js websocket server are routed through nginx on a single
external port. Various scripts are provided build the project, automatically
make the changes to the enCore database required for this setup, and fetch a
stock copy of enCore if you don't have one already to use.

