import { useEffect, useState, type ChangeEvent } from 'react';
import type { User } from '../../types/user';
import { ContactTabs } from './components/ContactTab';
import { ContactItem } from './components/ContactItem';
import {
  CONTACT_TABS_OPTIONS,
  CONTACT_TABS_VALUES,
} from '../../const/contactTabs';
import { Input } from '../Input/Input';

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
  const [value, setValue] = useState<string>('');

  const handleFilterTabChange = (activeTab: string) => {
    setFilteredContacts(
      activeTab === CONTACT_TABS_VALUES.online
        ? contacts.filter((contact) => contact.online)
        : contacts
    );
  };

  const handleFilterChange = (e: ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setValue(query);
    setFilteredContacts(
      contacts.filter((c) =>
        c.name.toLowerCase().includes(query.trim().toLowerCase())
      )
    );
  };

  useEffect(() => {
    setFilteredContacts(contacts);
  }, [contacts]);

  return (
    <section className="min-w-[260px] flex flex-col">
      <ContactTabs
        tabs={CONTACT_TABS_OPTIONS}
        onChange={handleFilterTabChange}
      />

      <div className="flex flex-col max-w-[260px] flex-1 p-4 justify-between">
        <div className="flex flex-col">
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
        <Input
          placeholder="Search..."
          onChange={handleFilterChange}
          value={value}
        />
      </div>
    </section>
  );
};
