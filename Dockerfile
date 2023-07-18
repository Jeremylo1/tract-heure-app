# ==== BUILD STAGE =====
# Use a Node 16 base image
FROM node:16-alpine as build
# Set the working directory to /app inside the container
WORKDIR /app
# Copy package.json and yarn.lock files
COPY package.json yarn.lock ./
# Install dependencies
RUN yarn install
# Copy other app files
COPY . .
# Build the app
RUN yarn build

# ==== RUN STAGE =====
# Use a lighter base image for the run stage
FROM node:16-alpine
# Set the working directory to /app inside the container
WORKDIR /app
# Copy only the built app from the build stage
COPY --from=build /app/build ./build
# Install serve
RUN yarn global add serve
# Expose the port on which the app will be running (5000 is the default that `serve` uses)
EXPOSE 5000
# Start the app
CMD ["serve", "-s", "build", "-l", "5000"]