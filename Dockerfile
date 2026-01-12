Step 1: Build the Angular app
Use the official Node.js image to build the app
FROM node:18 as build

Set the working directory inside the container
WORKDIR /app

Copy the package.json and package-lock.json to install dependencies
COPY package*.json ./

Install the dependencies
RUN npm install

Copy the rest of the application source code
COPY . .

Build the Angular app for production
RUN npm run build --prod

Step 2: Serve the app with Nginx
Use the official Nginx image to serve the app
FROM nginx:alpine

Copy the built Angular app from the previous stage
COPY --from=build /app/dist/your-angular-project-name /usr/share/nginx/html

Expose port 80
EXPOSE 80

Start Nginx
CMD ["nginx", "-g", "daemon off;"]