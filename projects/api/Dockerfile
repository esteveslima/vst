# Application docker image build

FROM --platform=linux/amd64 node:lts-alpine as base_stage

WORKDIR /app

FROM base_stage as install_dependencies_stage
COPY package.json .
COPY package-lock.json .
RUN npm install-clean --legacy-peer-deps

COPY . .

RUN npm run build && \
    rm -rf src && \    
    npm prune --production --legacy-peer-deps

EXPOSE 3000
CMD [ "node", "dist/main.js" ]