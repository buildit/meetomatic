module.exports = {
  client: {
    service: {
      name: "meetomatic",
      localSchemaFile: "./schema.gql"
    },
    includes: ["./pages/**/*.tsx", "client/**/*.ts"]
  }
};
