# Ceekrs Client

This project uses react to develop its ui components and is served as an extension to the chrome browser

## Local development setup

(_Requires NodeJs ^16_)

Please refer to these [instructions](https://nodejs.org/en/download/package-manager) to setup nodejs if you don't already have it.

### Installation steps

1. clone this repo

   ```sh
   git clone git@github.com:tobi-ace/VideoSearch.git
   ```

2. navigate to the client folder

   ```sh
   cd ceekrs/client
   ```

3. Install required dependencies using npm

   ```sh
   npm install
   ```

4. Build project - this will create a local build with all the necessary plugin files in a ./dist folder

   ```sh
   npm run build
   ```

5. load the generated dist folder as an unpacked extension in chrome and you are good to go!
