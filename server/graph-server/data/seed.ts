import { prisma } from "../generated/prisma-client";

async function populate() {
  const existingUser = await prisma.user({
    id: "cjuygqsd40ce40812ot28cdbd"
  });

  if (existingUser) {
    return {};
  }
  const user = await prisma.createUser({
    id: "cjuygqsd40ce40812ot28cdbd",
    name: "System",
    email: "system@wipro.com",
    password: "system"
  });

  return {
    user
  };
}

populate().then(data => console.log("Populated with data ", data));
