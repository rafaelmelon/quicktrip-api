import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash("demo1234", 12);

  const user = await prisma.user.upsert({
    where: { email: "demo@quicktrip.dev" },
    update: {},
    create: {
      email: "demo@quicktrip.dev",
      username: "demo",
      passwordHash,
    },
  });

  const route = await prisma.route.upsert({
    where: { id: "00000000-0000-0000-0000-000000000001" },
    update: {},
    create: {
      id: "00000000-0000-0000-0000-000000000001",
      userId: user.id,
      name: "Barcelona Museum Tour",
      category: "museum",
      estimatedMinutes: 180,
      originName: "Plaça Catalunya",
      originLat: 41.387,
      originLng: 2.17,
      destinationName: "Barceloneta Beach",
      destinationLat: 41.3784,
      destinationLng: 2.1925,
      stops: {
        create: [
          {
            name: "MACBA",
            address: "Plaça dels Àngels, 1",
            lat: 41.3833,
            lng: 2.1669,
            position: 0,
          },
          {
            name: "Museu Picasso",
            address: "Carrer Montcada, 15-23",
            lat: 41.3853,
            lng: 2.1811,
            position: 1,
          },
        ],
      },
    },
  });

  await prisma.note.upsert({
    where: { id: "00000000-0000-0000-0000-000000000002" },
    update: {},
    create: {
      id: "00000000-0000-0000-0000-000000000002",
      routeId: route.id,
      userId: user.id,
      content: "Don't miss the Picasso blue period gallery on the second floor!",
    },
  });

  console.log("Seed completed: demo user + sample route created");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
