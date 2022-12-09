FROM node:18
WORKDIR /nahida_project/anime/management
COPY ./ .
RUN npm i -g pnpm
RUN pnpm install
CMD ["pnpm", "dev", "--host"]