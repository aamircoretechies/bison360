
import {
  ChannelStats,
  EarningsChart,
  EntryCallout,
  Highlights,
  TeamMeeting,
  IStatisticsItems,
  Teams,
  Statistics,
  SalesOverview,
  Compliance,
  RecentOrders
} from './components';

export function Demo1LightSidebarContent() {
    const details: IStatisticsItems = [
    { image: 'out-of-stock.png', number: '6', label: 'Low Stock' },
    { image: 'low.png', number: '4', label: 'Expiry Soon' },
    { image: 'no-internet.png', number: '3', label: 'Devices Offline' },
    { image: 'sync.png', number: '12', label: 'Unsynced Records' },

  ];
  return (
    <div className="grid gap-5 lg:gap-7.5">
      <div className="grid lg:grid-cols-3 gap-y-5 lg:gap-7.5 items-stretch">
        <div className="lg:col-span-3">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-7.5 h-full items-stretch">
            <ChannelStats />
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-5 lg:gap-7.5 items-stretch">
        <div className="lg:col-span-1">
          <Highlights limit={3} />
        </div>
        <div className="lg:col-span-2">
          <EarningsChart />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-y-5 lg:gap-7.5">
        <div className="col-span-2 lg:col-span-3">
          <Statistics details={details} />
        </div>


      </div>

      <div className="grid lg:grid-cols-4 gap-5 lg:gap-7.5 items-stretch">
        <div className="lg:col-span-2">
          <SalesOverview limit={3} />
        </div>
        <div className="lg:col-span-2">
          <Compliance title="Compliances"/>
        </div>
      </div>
       <div className="grid lg:grid-cols-1 gap-5 lg:gap-7.5 items-stretch">
        <div className="lg:col-span-1">
          <RecentOrders  />
        </div>
      </div>
    </div>
  );
}
