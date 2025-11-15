import { useState } from 'react';
import type { ContactTab } from '../../../types/contactTab';
import { cn } from '../../../utils/cn';
import { getContactTabsClassNames } from '../../../utils/contactTabs';

type ContactTabsProps = {
  tabs: ContactTab[];
  onChange: (activeTab: string) => void;
};

export const ContactTabs = ({ tabs, onChange }: ContactTabsProps) => {
  const [activeTab, setActiveTab] = useState(tabs[0].value);

  const handleChange = (newTab: string) => {
    setActiveTab(newTab);
    onChange?.(newTab);
  };

  return (
    <div className="flex ">
      {tabs.map((tab, index) => {
        const classNames = getContactTabsClassNames({
          activeTab,
          tabs,
          currentTabValue: tab.value,
          index,
        });

        return (
          <button
            key={tab.value}
            className={cn(
              'flex-1 text-sm py-2 text-center cursor-pointer',
              classNames
            )}
            onClick={() => handleChange(tab.value)}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
};
