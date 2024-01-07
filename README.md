## Draw2Gather Website

This repository contains Draw2Gather website, an SPA built with Svelte/Sveltekit. Main branch is for production, it's currently available at https://draw2gather.online. Website works together with our [API](https://github.com/INF303Project/draw2gather), in order to run this application you first have to setup the API and install NodeJS.

### Configuration

To run this locally, you should use the `demo` brach, demo branch is configured to make API calls to `localhost:8080`. You can change it with `API_URL` variable. Also when you run this with default `Vite` server, it listens port `5173`, if you run it on another port, we also have to configure CORS settings of the API. Server not only serves to your machine, but also your local network, therefore you can access the website from other devices, but again CORS settings will not allow them, thus configure it with your IP.

### Setup

- Clone the repository
    ```
    git clone https://github.com/INF303Project/draw2gather-web.git
    ```

- Checkout to demo branch
    ```
    cd draw2gather-web
    git checkout demo
    ```

- Install dependencies
    ```
    npm i
    ```

- Run server
    ```
    npm run dev
    ```
