import { env } from "./config/env.js";
import { buildApp } from "./app.js";

async function main() {
  const app = await buildApp();

  await app.listen({ port: env.PORT, host: env.HOST });
  console.log(`Server running at http://${env.HOST}:${env.PORT}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
