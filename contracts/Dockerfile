FROM node:18-alpine

WORKDIR /app

COPY package.json pnpm-lock.yaml* ./
RUN npm install -g pnpm && pnpm install

COPY . .

EXPOSE 8545

CMD ["npx", "hardhat", "node"] 