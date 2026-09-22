import { expireRegistrations } from "@/jobs/expire-registrations";
import { reconcilePayments } from "@/jobs/reconcile-payments";

async function runJob(name: "expire" | "reconcile") {
  const startedAt = new Date().toISOString();
  const result = name === "expire" ? await expireRegistrations() : await reconcilePayments();
  console.log(JSON.stringify({ job: name, startedAt, finishedAt: new Date().toISOString(), result }));
}

async function runAll() {
  await runJob("expire");
  await runJob("reconcile");
}

async function main() {
  const command = process.argv[2] ?? "all";

  if (command === "expire" || command === "reconcile") {
    await runJob(command);
    return;
  }

  if (command === "all") {
    await runAll();
    return;
  }

  throw new Error(`Comando de job inválido: ${command}. Use expire, reconcile ou all.`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});