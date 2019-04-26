# meetomatic

a simple and necessary tool for distributed meetings, embracing our in-house design system, Gravity.

## Requirements

The Prisma server and database run in docker container so you need to install [Docker](https://docs.docker.com/docker-for-mac/install/)

`gravity-web-ui` requires Node.js version 8 installed. You can either install version 8 and use [nvm](https://github.com/creationix/nvm) to manage your node versions.

    $ nvm install

and before running any other npm command, run

    $ nvm use

## Build and setup

### Prisma and database

To run the Prisma server and setup the databaes run

    $ docker-compose up -d

This will start the prisma and postgres containers.

To deploy the database run

    $ cd server/graph-server
    $ prisma deploy

Note you only have to run this command when setting up for the first time or if you change the Prisma schema.  
This will automatically generate the Prisma .js files

### Meet-o-matic server

To run the meet-o-matic service run

    $ npm run dev

### Server GraphQl Types

At the server we use [`type-graphql`](https://github.com/19majkel94/type-graphql) to define our graphql schema. This allows us to take advantage of Typescript and write stronly typed resolvers.

When you update the graphql type definition the server will generate a `schema.gql` file which is then used by the client. see below

### Client GraphQl Types

The cleint uses Apollo client at the front end. It makes use of strongly typed query and mutations by using the apollo codegen functionality

If you write a grahpql query in the client pages run the following command to generate the Typescript types for your query.

\$ npm run generate-graphql-types

TODO:

- Document service
- How to write and run tests
- How to debug

## Managing the docker containers

To stop the docker containers run

    $ dcoker-compose down

To list all containers run

    $ docker container ls -a

To delete the containers run

    $ docker container rm <name of the container>

or to delete all stoped containers run

    $ docker container prune

The database files are mapped to a docker volume on your local disk so they persist between container restarts.

To delete the volume and reset all database data run

    $ docker volume rm meetomatic_postgres
