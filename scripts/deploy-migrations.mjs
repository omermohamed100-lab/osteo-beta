import { spawnSync } from 'node:child_process';

const baseline = '20260515000000_initial_schema';
const prismaCommand = process.platform === 'win32' ? 'prisma.cmd' : 'prisma';

function runPrisma(args) {
  const result = spawnSync(prismaCommand, args, {
    encoding: 'utf8',
    env: process.env,
    stdio: 'pipe',
  });

  if (result.stdout) process.stdout.write(result.stdout);
  if (result.stderr) process.stderr.write(result.stderr);
  if (result.error) throw result.error;
  return {
    status: result.status ?? 1,
    output: `${result.stdout ?? ''}\n${result.stderr ?? ''}`,
  };
}

let deployment = runPrisma(['migrate', 'deploy']);

if (deployment.status !== 0 && deployment.output.includes('P3005')) {
  console.log(`Existing schema detected; recording idempotent baseline ${baseline}.`);
  const resolution = runPrisma(['migrate', 'resolve', '--applied', baseline]);
  if (resolution.status !== 0) process.exit(resolution.status);
  deployment = runPrisma(['migrate', 'deploy']);
}

if (deployment.status !== 0) process.exit(deployment.status);
