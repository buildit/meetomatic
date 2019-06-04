import { Field, ObjectType, InputType } from "type-graphql";

@ObjectType()
export default class User {
  @Field()
  id!: string;

  @Field()
  email!: string;

  @Field()
  name!: string;
}

@ObjectType()
export class AuthPayload {
  @Field()
  token!: string;

  @Field({ nullable: false })
  user!: User;
}

@InputType()
export class SignUpInput {
  @Field()
  email!: string;

  @Field()
  password!: string;

  @Field()
  name!: string;
}

@InputType()
export class LoginInput {
  @Field()
  email!: string;

  @Field()
  password!: string;
}
