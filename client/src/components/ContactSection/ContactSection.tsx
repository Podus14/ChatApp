import { useEffect, useState } from 'react';
import type { User } from '../../types/user';
import { ContactTabs } from './components/ContactTab';
import { ContactItem } from './components/ContactItem';
import {
  CONTACT_TABS_OPTIONS,
  CONTACT_TABS_VALUES,
} from '../../const/contactTabs';

type ContactSectionProps = {
  contacts: User[];
  selectedContact: User | null;
  onSelectChat: (contact: User) => void;
};

export const ContactSection = ({
  contacts,
  selectedContact,
  onSelectChat,
}: ContactSectionProps) => {
  const [filteredContacts, setFilteredContacts] = useState(contacts);

  const handleFilterContacts = (activeTab: string) => {
    setFilteredContacts(
      activeTab === CONTACT_TABS_VALUES.online
        ? contacts.filter((c) => c.online)
        : contacts
    );
  };

  useEffect(() => {
    setFilteredContacts(contacts);
  }, [contacts]);

  return (
    <div className="max-w-[260px] flex flex-col">
      <ContactTabs
        tabs={CONTACT_TABS_OPTIONS}
        onChange={handleFilterContacts}
      />

      <div className="flex flex-col overflow-y-auto">
        {filteredContacts.length > 0 ? (
          filteredContacts.map((contact) => (
            <ContactItem
              key={contact.id}
              contact={contact}
              selectedContact={selectedContact}
              onSelectChat={onSelectChat}
            />
          ))
        ) : (
          <p className="text-sm text-center py-4">No users found</p>
        )}
      </div>
    </div>
  );
};
