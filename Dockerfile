# Usar imagem oficial do Node.js
FROM node:20-alpine

# Criar diretório de trabalho
WORKDIR /app

# Copiar arquivos de dependências
COPY package*.json ./
COPY backend/package*.json ./backend/

# Instalar dependências (incluindo as do backend)
RUN npm install
RUN cd backend && npm install

# Copiar o restante do código
COPY . .

# Buildar o frontend
RUN npm run build

# Expor a porta que o sistema usa
EXPOSE 3333

# Comando para rodar a aplicação
CMD ["npm", "run", "server"]
