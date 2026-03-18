export const STATUSES = [
  'new_lead',
  'contacted',
  'requirement_collected',
  'property_suggested',
  'visit_scheduled',
  'visit_completed',
  'booked',
  'lost'
];

export const STATUS_COLORS = {
  new_lead: 'bg-blue-100 text-blue-700',
  contacted: 'bg-yellow-100 text-yellow-700',
  requirement_collected: 'bg-orange-100 text-orange-700',
  property_suggested: 'bg-cyan-100 text-cyan-700',
  visit_scheduled: 'bg-purple-100 text-purple-700',
  visit_completed: 'bg-gray-100 text-gray-700',
  booked: 'bg-green-100 text-green-700',
  lost: 'bg-red-100 text-red-700'
};

export const COL_STYLE = {
  new_lead: { header: 'bg-blue-500', bg: 'bg-blue-50' },
  contacted: { header: 'bg-yellow-500', bg: 'bg-yellow-50' },
  requirement_collected: { header: 'bg-orange-500', bg: 'bg-orange-50' },
  property_suggested: { header: 'bg-cyan-500', bg: 'bg-cyan-50' },
  visit_scheduled: { header: 'bg-purple-500', bg: 'bg-purple-50' },
  visit_completed: { header: 'bg-gray-500', bg: 'bg-gray-50' },
  booked: { header: 'bg-green-500', bg: 'bg-green-50' },
  lost: { header: 'bg-red-500', bg: 'bg-red-50' }
};
