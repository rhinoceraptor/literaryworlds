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

## Scripts

- `build.sh`: builds the docker-compose stack
- `up.sh`: builds and starts the docker-compose stack
- `configure_moo.sh`: connects to LambdaMOO and configures the database to use
  the domain name, external web port, etc. set in `.env` (run `cp local.env .env`
  and fill in the environment variables appropriately)
- `connect_to_lambdamoo.sh`: Opens a netcat session running in the LambdaMOO
  container. The docker-compose configuration does not directly expose the TCP
  port for connecting to LambdaMOO, to prevent it being exposed on the network.
- `fetch_stock_encore.sh`: Fetches a stock copy of enCore and places it in the
  `./encore` directory. This is useful for getting the stack running.

## Setup Notes
You will need an enCore database, either a stock database or one you provide.
Note that your database will be modified in order to work with this setup,
several verbs will be changed.

## Setup Instructions for Ubuntu
Install docker:
```bash
sudo apt install -y docker docker-compose
sudo usermod -aG docker $(whoami)
sudo su $(whoami)
```

Clone this repository:
```bash
git clone https://github.com/rhinoceraptor/literaryworlds.git
cd literaryworlds
```

Now you need to add enCore files and a LambdaMOO database.

You can use a stock enCore database, by running
```bash
./scripts/fetch_stock_encore.sh
```

At the prompt, type `y` and hit enter.

If you want to use your own copy of enCore files and LambdaMOO database, place
your encore files in the `encore/` directory, and place your LambdaMOO database
in the `db/` directory, and it must be named `enCore.db`.

Next, start the server:
```bash
./scripts/up.sh
```

After a few minutes, the server will be running, and enCore will be running on
`http://localhost`, so open that URL in your web browser.

To stop the server, press ctrl-c.

