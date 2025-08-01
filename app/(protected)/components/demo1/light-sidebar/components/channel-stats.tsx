import { Fragment } from 'react';
import { toAbsoluteUrl } from '@/lib/helpers';
import { Card, CardContent } from '@/components/ui/card';
import { Package, Ham, Timer, DollarSign } from 'lucide-react';

interface IChannelStatsItem {
  logo: React.ElementType;
  logoDark?: string;
  info: string;
  desc: string;
  path: string;
}
type IChannelStatsItems = Array<IChannelStatsItem>;

type Props = {
  component: React.ElementType;
};

export function DynamicComponent({ component: Component }: Props) {
  return <Component />;
}

const ChannelStats = () => {
  const items: IChannelStatsItems = [
    { logo: Package, info: '128', desc: 'Total Orders Today', path: '' },
    { logo: Ham, info: '465 / 12', desc: 'Total Bison (Alive/Deceased)', path: '' },
    {
      logo: Timer,
      info: '1.8 hrs',
      desc: 'Avg Fulfillment Time',
      path: '',
    },
    {
      logo: DollarSign,
      info: '$1,520.00',
      desc: 'Revenue Today',
      path: '',
    },
  ];

  const renderItem = (item: IChannelStatsItem, index: number) => {
    return (
      <Card key={index} className=' border-0 '>
        <CardContent className="p-0 flex flex-col justify-between gap-6 h-full bg-cover rtl:bg-[left_top_-1.7rem] bg-[right_top_-1.7rem] bg-no-repeat channel-stats-bg">
          <div className='mt-4 ml-6 rounded-full bg-primary/20 w-4 h-4 text-primary'>
          <DynamicComponent component={item.logo} />
          </div>
          <div className="flex flex-col gap-1 pb-4 px-5">
            <span className="text-3xl font-semibold text-mono">
              {item.info}
            </span>
            <span className="text-sm font-normal text-muted-forehead">
              {item.desc}
            </span>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <Fragment>
      <style>
        {`
          .channel-stats-bg {
            background-image: url('${toAbsoluteUrl('/media/images/2600x1600/bg-3.png')}');
          }
          .dark .channel-stats-bg {
            background-image: url('${toAbsoluteUrl('/media/images/2600x1600/bg-3-dark.png')}');
          }
        `}
      </style>

      {items.map((item, index) => {
        return renderItem(item, index);
      })}
    </Fragment>
  );
};

export { ChannelStats, type IChannelStatsItem, type IChannelStatsItems };
