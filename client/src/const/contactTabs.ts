export const CONTACT_TABS_LABELS = {
  all: 'ALL',
  online: 'Online',
} as const;

export type ContactTabLabel =
  (typeof CONTACT_TABS_LABELS)[keyof typeof CONTACT_TABS_LABELS];

export const CONTACT_TABS_VALUES = {
  all: 'all',
  online: 'online',
} as const;

export const CONTACT_TABS_OPTIONS = [
  { label: CONTACT_TABS_LABELS.online, value: CONTACT_TABS_VALUES.online },
  { label: CONTACT_TABS_LABELS.all, value: CONTACT_TABS_VALUES.all },
];
