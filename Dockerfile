# Etapa de construcción
FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .


# Etapa final
FROM node:22-alpine
WORKDIR /app
COPY --from=builder /app .
ENV NODE_ENV=production
EXPOSE 3000
CMD ["npm", "start"]
