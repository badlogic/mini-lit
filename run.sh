#!/bin/bash

set -e

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

PROJECT=minilit
SERVER=slayer.marioslab.io
SERVER_DIR=/home/badlogic
DOMAIN=minilit.mariozechner.at

sync_files() {
    echo "Syncing files..."
    rsync -avz --delete \
      example/dist/ \
      $SERVER:$SERVER_DIR/$DOMAIN/dist/

    rsync -avz \
      infra/ \
      $SERVER:$SERVER_DIR/$DOMAIN/infra/

    rsync -avz \
      run.sh \
      $SERVER:$SERVER_DIR/$DOMAIN/
}

build() {
    echo "Building mini-lit..."
    npm install
    npm run build
    echo "Building example site..."
    cd example
    npm install
    npm run build
    cd ..
}

pushd "$SCRIPT_DIR" > /dev/null

case "$1" in
build)
    build
    ;;
prod)
    echo "Starting production server..."
    docker compose -p $PROJECT -f infra/docker-compose.yml -f infra/docker-compose.prod.yml up -d --build
    ;;
stop)
    echo "Stopping services..."
    docker compose -p $PROJECT -f infra/docker-compose.yml -f infra/docker-compose.prod.yml down
    ;;
logs)
    docker compose -p $PROJECT -f infra/docker-compose.yml -f infra/docker-compose.prod.yml logs -f
    ;;
logs-remote)
    echo "Streaming logs from $DOMAIN..."
    ssh -t $SERVER "cd $SERVER_DIR/$DOMAIN && ./run.sh logs"
    ;;
deploy)
    build
    echo "Deploying $PROJECT to $DOMAIN..."
    sync_files

    echo "Restarting services..."
    ssh $SERVER "cd $SERVER_DIR/$DOMAIN && ./run.sh stop && ./run.sh prod"

    echo "✅ Deployed to https://$DOMAIN"
    ;;
sync)
    build
    echo "Syncing $PROJECT to $DOMAIN..."
    sync_files
    echo "✅ Synced to $DOMAIN"
    ;;
*)
    echo "Usage: $0 {build|prod|stop|logs|logs-remote|deploy|sync}"
    echo ""
    echo "  build       - Build example site locally"
    echo "  prod        - Start production server (background)"
    echo "  stop        - Stop all services"
    echo "  logs        - Show container logs"
    echo "  logs-remote - Show logs from remote server"
    echo "  deploy      - Build, sync and restart services"
    echo "  sync        - Sync files only, no restart"
    exit 1
    ;;
esac

popd > /dev/null