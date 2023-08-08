# Ceekrs Client

A significant amount of valuable information is publicly available in video form, unfortunately, a large proportion of this is long-form content and spans hours. Learners and innovators need a way to be able to access relevant information quickly. Ceekrs client enables flexible and robust searches within Youtube videos. 

It is served as a browser extension with v0.1.0 already available in Chrome.

<img width="1275" alt="Screenshot 2023-08-08 at 23 09 47" src="https://github.com/lawalbolaji/ceekrs-client/assets/22568024/40fe2f80-c222-4883-a440-4e4c3e0ce7c3">


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
