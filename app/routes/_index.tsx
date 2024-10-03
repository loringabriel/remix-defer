import { type MetaFunction } from '@remix-run/node';
import { Await, defer, useLoaderData } from '@remix-run/react';
import { Suspense } from 'react';

export const meta: MetaFunction = () => {
  return [
    { title: 'New Remix App' },
    { name: 'description', content: 'Welcome to Remix!' },
  ];
};

export async function loader() {
  const fastPromise = new Promise((resolve) => {
    setTimeout(() => {
      resolve('Fast data: ABC (1 sec)');
    }, 1000);
  });
  const slowPromise = new Promise((resolve) => {
    setTimeout(() => {
      resolve('Slow data: ABC (2.5 sec)');
    }, 2500);
  });

  const superSlowPromise = new Promise((resolve) => {
    setTimeout(() => {
      resolve('Super slow data: ABC (4 sec)');
    }, 4000);
  });

  return defer({
    critical: 'critical data (0 sec)',
    fastPromise: fastPromise,
    slowPromise: slowPromise,
    superSlowPromise: superSlowPromise,
  });
}

export default function Index() {
  const {critical, fastPromise, slowPromise, superSlowPromise} = useLoaderData<typeof loader>();

  return (
    <div className="flex h-screen items-center justify-center">
      <div className="flex flex-col items-center gap-16">
        <header className="flex flex-col items-center gap-5">
          <h1 className="leading p-5 text-left w-full text-xl font-semibold text-gray-800 dark:text-gray-100 flex flex-col gap-5 ">
            <div className='text-green-400'>
              Instant data: {critical}
            </div>
            <div>
              <Suspense fallback={'Loading fast promise (1 sec)'}>
                <Await resolve={fastPromise}>
                  {(resolvedValue) => <span className='text-green-400'><>{resolvedValue}</> </span>}
                </Await>
              </Suspense>
            </div>
            <div>
              <Suspense
                fallback={'Loading slow promise (2.5 sec)'}
              >
                <Await resolve={slowPromise}>
                  {(resolvedValue) => <span className='text-green-400'><>{resolvedValue}</> </span>}
                </Await>
              </Suspense>
            </div>
            <div>
              <Suspense fallback={'Loading super slow promise (4 sec)'}>
                <Await resolve={superSlowPromise}>
                  {(resolvedValue) => <span className='text-green-400'><>{resolvedValue}</> </span>}
                </Await>
              </Suspense>
            </div>
          </h1>
          <div className="h-[144px] w-[434px]">
            <img
              src="/logo-light.png"
              alt="Remix"
              className="block w-full dark:hidden"
            />
            <img
              src="/logo-dark.png"
              alt="Remix"
              className="hidden w-full dark:block"
            />
          </div>
        </header>
      </div>
    </div>
  );
}
