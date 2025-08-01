import { ReactNode } from 'react';
import Link from 'next/link';
import { toAbsoluteUrl } from '@/lib/helpers';
import { Card, CardContent } from '@/components/ui/card';

export function BrandedLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <style>
        {`
          .branded-bg {
            background-image: url('${toAbsoluteUrl('/media/images/bg-auth.jpg')}');
          }
          .dark .branded-bg {
            background-image: url('${toAbsoluteUrl('/media/images/bg-auth.jpg')}');
          }
        `}
      </style>
      <div className="grid lg:grid-cols-2 grow">
        

        <div className="lg:rounded-xl lg:border lg:border-border lg:m-5 order-1 lg:order-1 bg-top xxl:bg-center xl:bg-cover bg-no-repeat branded-bg">
          <div className="flex flex-col p-8 lg:p-16 gap-4">
            <Link href="/">
              <img
                src={toAbsoluteUrl('/media/app/mini-logo.svg')}
                className="h-[88px] max-w-none"
                alt=""
              />
            </Link>

            <div className="flex flex-col gap-3">
              <h3 className="text-2xl font-semibold text-white">
                Bison360 Back-Office
              </h3>
              <div className="text-base font-medium text-white/70">
                A robust authentication gateway ensuring
                <br /> secure&nbsp;
                <span className="text-white/70 font-semibold">
                  efficient user access
                </span>
                &nbsp;to the back-office panel of
                <br /> Bison360.
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-center items-center p-8 lg:p-10 order-2 lg:order-2">
          <Card className="w-full max-w-[400px]">
            <CardContent className="p-6">{children}</CardContent>
          </Card>
        </div>


      </div>
    </>
  );
}
