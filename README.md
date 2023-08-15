# bitcoind-dashboard

![bitcoind-dashboard](https://github.com/mu373/bitcoind-dashboard/assets/2176670/3f98513c-ec06-4492-bd86-52736446de21)

## Getting Started

```sh
# Setup docker-compose
cp docker-compose-template.yml docker-compose.yml
cp docker-compose-dev-template.yml docker-compose-dev.yml

# Developing
docker compose -f docker-compose-dev.yml up -d
# Deploying
docker compose -f docker-compose.yml up -d
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
