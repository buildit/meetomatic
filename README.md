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
This will automatically generate the Prisma .ts files

### Seeding the database with default data

When you first deploy the prisma database it will seed the database with a system user. If you need to re-seed the database run this command from the `graph-server` folder

    $ prisma seed

### Resetting the database

To clear all data from the database run

    $ prisma reset && prisma seed

### Meet-o-matic server

To run the meet-o-matic service run

    $ npm run dev

### API Server GraphQl

At the API server we use [`type-graphql`](https://github.com/19majkel94/type-graphql) to define our graphql schema. This allows us to take advantage of Typescript and write stronly typed resolvers.

When you update the graphql type definition the server will generate a `schema.gql` file which is then used by the client. see below

Follow recommendations laid out in [this article](https://blog.apollographql.com/designing-graphql-mutations-e09de826ed97) when designing your schema.

### Client GraphQl Types

The client uses Apollo client at the front end. It makes use of strongly typed query and mutations by using the apollo codegen functionality

If you write a grahpql query in the client pages run the following command to generate the Typescript types for your query.

    $ npm run generate-graphql-types

You can then use the generated types to strongly type your Query and Mutations

```javascript
const LOGIN_USER = gql`
  mutation Login($email: String!, $password: String!) {
    login(input: { email: $email, password: $password }) {
      token
      user {
        name
        id
        email
      }
    }
  }
`;

class LoginMutation extends Mutation<Login, LoginVariables> {}
```

Then use it:

```javascript
<LoginMutation mutation={LOGIN_USER} onCompleted={this._handleLoginComplete}>
  {function(loginUser, { loading, error }) {
    return (
      <LoginForm
        error={error && error.graphQLErrors[0].message}
        isProcessing={loading}
        login={(email, password) =>
          loginUser({ variables: { email, password } })
        }
      />
    );
  }}
</LoginMutation>
```

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
