# Build production images
docker build -f docker/Dockerfile.web -t wrestling-coaches-web .
docker build -f docker/Dockerfile.bot -t wrestling-coaches-bot .

# Run web only
docker run -p 3000:3000 -e NODE_ENV=production wrestling-coaches-web

# Run with docker-compose (recommended)
cp .env.example .env
# Edit .env with your values
docker-compose -f docker/docker-compose.yml up -d

# Stop
docker-compose -f docker/docker-compose.yml down

# View logs
docker-compose -f docker/docker-compose.yml logs -f
