'use client';

import React from 'react';
import { toAbsoluteUrl } from '@/lib/helpers';
import { Card, CardContent } from '@/components/ui/card';

interface IStatisticsItem {
  image: string;
  number: string;
  label: string;
}
type IStatisticsItems = Array<IStatisticsItem>;

interface IStatisticsProps {
  details: IStatisticsItem[];
}

const Statistics = ({ details }: IStatisticsProps) => {
  const renderData = (item: IStatisticsItem, index: number) => {
    return (
      <React.Fragment key={index}>
        <div className="flex flex-col md:flex-row items-center gap-3 flex-1 min-w-[200px] ">
          <div className="flex w-full justify-self-center items-center gap-3">
            <img
              src={toAbsoluteUrl(`/media/png/${item.image}`)}
              className="h-10 max-w-full"
              alt="image"
            />
            <div className="grid grid-cols-1 place-content-center flex-1">
              <span className="text-mono text-2xl lg:text-2xl font-semibold">
                {item.number}
              </span>
              <span className="text-secondary-foreground text-sm">
                {item.label}
              </span>
            </div>
          </div>
        </div>
       {/*  <span className="not-last:border-e border-e-input my-1"></span> */}
      </React.Fragment>
    );
  };

  return (
    <Card>
      <CardContent>
       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6 px-5 lg:px-10 py-4">
          {details.map((item, index) => {
            return renderData(item, index);
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export {
  Statistics,
  type IStatisticsItem,
  type IStatisticsItems,
  type IStatisticsProps,
};
