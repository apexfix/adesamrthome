import { cookies } from 'next/headers';

export default async function FailingPage() {
  if ((await cookies()).get('fixture_failure')?.value === 'on') throw new Error('Synthetic Next page failure');
  return <main style={{ padding: '160px 24px' }}><h1>Recovered Next fixture page</h1></main>;
}
