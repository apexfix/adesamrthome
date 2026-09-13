import { cookies } from 'next/headers';
import RootLayout from '../../../../src/app/layout';

export default async function FixtureLayout({ children }: { children: React.ReactNode }) {
  if ((await cookies()).get('fixture_root_failure')?.value === 'on') throw new Error('Synthetic Next root failure');
  return <RootLayout>{children}</RootLayout>;
}
