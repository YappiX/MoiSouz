FROM node:20-alpine3.20
WORKDIR /var/www
COPY package.json yarn.lock .env ./
#RUN npm install
# Add any dependencies required to build modules ie: modules with native code.
RUN apk add --no-cache \
	build-base \
	cairo-dev \
	libpng-dev \
	g++ \
	pango-dev \
	python3 \
	;
	
RUN yarn install
EXPOSE 3000

#COPY pages ./pages
#COPY src ./src
#RUN yarn build

#FROM node:lts as builder
#WORKDIR /var/www
#COPY --from=dependencies node_modules ./node_modules
#RUN yarn build

#FROM node:lts as runner
#WORKDIR /var/www
#ENV NODE_ENV production

#COPY --from=builder public ./public
#COPY --from=builder package.json ./package.json
#COPY --from=builder .next ./.next
#COPY --from=builder node_modules ./node_modules


#CMD ["yarn", "start"]
