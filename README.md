# Comlink Sandbox

This is a sandbox for experimenting with Comlink, a library for creating remote procedure calls between web workers and the main thread.

## Core Idea

- This application allows to interact between a SharedWorker and the ports connected to it.
- The main goal of the application is to explore techniques to detect when a port has disconnected from the SharedWorker.

## The Application

### Dashboard

- Allows to load client instances.
- Displays information about the system.
- Is the main application and the main vite entry point.

### Client

- Is an additional vite entry point.
- Is loaded into the dashboard using an iframe.
