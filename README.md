# bitcoind-dashboard

Simple dashboard for bitcoind. Designed to work with bitcoind running in another Docker container: [mu373/docker-bitcoind](https://github.com/mu373/docker-bitcoind).

![bitcoind-dashboard](https://github.com/mu373/bitcoind-dashboard/assets/2176670/f77aa6f5-e8c7-461d-b64d-1ada61b87f63)

## Setup
```sh
# Setup environment variables
cp .env.local.sample .env.local
vim .env.local

# Setup docker-compose
cp docker-compose-dev-template.yml docker-compose-dev.yml #For development
cp docker-compose-template.yml docker-compose.yml # For production 
```

If you want to easily enable HTTPS access for production using [traefik](https://github.com/mu373/traefik), you can use [this docker-compose template](https://github.com/mu373/bitcoind-dashboard/blob/main/docker-compose-traefik-template.yml).

## Getting Started
```sh
docker compose -f docker-compose-dev.yml up -d # For development
docker compose -f docker-compose.yml up -d #For production
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
