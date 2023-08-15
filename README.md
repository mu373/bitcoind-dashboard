# bitcoind-dashboard

Simple dashboard for bitcoind. Designed to work with bitcoind running in another Docker container: [mu373/docker-bitcoind](https://github.com/mu373/docker-bitcoind).

![bitcoind-dashboard](https://github.com/mu373/bitcoind-dashboard/assets/2176670/3f98513c-ec06-4492-bd86-52736446de21)

## Setup
```sh
# Setup environment variables
cp .env.local.sample .env.local
vim .env.local

# Setup docker-compose
cp docker-compose-dev-template.yml docker-compose-dev.yml #For development
cp docker-compose-template.yml docker-compose.yml # For production 
```

## Getting Started
```sh
docker compose -f docker-compose-dev.yml up -d # For development
docker compose -f docker-compose.yml up -d #For production
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.