import type { ContactTab } from '../types/contactTab';
import { cn } from './cn';

export const getContactTabsClassNames = ({
  activeTab,
  tabs,
  currentTabValue,
  index,
}: {
  activeTab: string;
  tabs: ContactTab[];
  currentTabValue: string;
  index: number;
}) => {
  const isActive = activeTab === currentTabValue;
  const isFirst = index === 0;
  const isLast = index === tabs.length - 1;

  const borderClasses = isActive
    ? 'border-none'
    : isFirst
    ? 'border-r border-b border-primary'
    : isLast
    ? 'border-l border-b border-primary'
    : 'border-b border-primary';

  const classNames = cn(isActive ? 'bg-white' : 'bg-tab', borderClasses);

  return classNames;
};
