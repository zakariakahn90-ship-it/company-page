export interface HajjPackage {
  id: string;
  packageNumber: string;
  title: string;
  duration: string;
  type: 'Fixed Aziziya' | 'Shifting';
  moraCode: string;
  badge: string;
  description: string;
  makkahHotel: string;
  makkahDistance: string;
  madinahHotel: string;
  madinahDistance: string;
  tentCategory: string;
  rates: {
    sharing: number;
    triple: number;
    double: number;
  };
  highlights: string[];
}

export const HAJJ_PACKAGES: HajjPackage[] = [
  {
    id: 'pkg-1-131',
    packageNumber: 'Package 1',
    title: '14±1 Days Package',
    duration: '14±1 Days',
    type: 'Fixed Aziziya',
    moraCode: '1-131 - Mora Approved',
    badge: 'MORA Approved: 1-131',
    description: 'Executive short-duration Hajj package designed for professionals, with Rotana Jabal Omar Makkah (150m), Markazia Madinah, and fixed Azizya accommodation.',
    makkahHotel: 'Rotana Jabal Omar Makkah',
    makkahDistance: '150 Meters from Haram Courtyard',
    madinahHotel: '3/4-Star Markazia Hotels',
    madinahDistance: '250–300m from Roza Mubarak',
    tentCategory: 'Makteb-C Air-Conditioned Upgraded Camps',
    rates: {
      sharing: 1780000,
      triple: 1830000,
      double: 1900000,
    },
    highlights: [
      'Rotana Jabal Omar Makkah (150m)',
      '3/4-Star Markazia (250–300m Roza Mubarak)',
      'Makteb-C Air-Conditioned Upgraded Camps',
      'Full Board (3 Daily Buffet Meals)',
      'Qurbani Included in Package',
      'Seat-by-Seat Luxury AC Transport',
    ],
  },
  {
    id: 'pkg-2-95',
    packageNumber: 'Package 2',
    title: '18±1 Days Package',
    duration: '18±1 Days',
    type: 'Shifting',
    moraCode: '2-95 Mora Approved',
    badge: 'MORA Approved: 2-95',
    description: 'Our most popular family and group choice offering an optimal balance of prayer days in Makkah Mukarramah (Rotana Jabal Omar Makkah, 150m) and Madinah Munawwarah.',
    makkahHotel: 'Rotana Jabal Omar Makkah',
    makkahDistance: '150 Meters from Haram Courtyard',
    madinahHotel: '3/4-Star Markazia Hotels',
    madinahDistance: '250–300m from Roza Mubarak',
    tentCategory: 'Makteb-C Air-Conditioned Upgraded Camps',
    rates: {
      sharing: 1880000,
      triple: 1980000,
      double: 2100000,
    },
    highlights: [
      'Rotana Jabal Omar Makkah (150m)',
      '3/4-Star Markazia (250–300m Roza Mubarak)',
      'Makteb-C Air-Conditioned Upgraded Camps',
      'Full Board (3 Daily Buffet Meals)',
      'Qurbani Included in Package',
      'Complimentary Comprehensive Hajj Kits',
    ],
  },
  {
    id: 'pkg-3-55',
    packageNumber: 'Package 3',
    title: '27±1 Days Package',
    duration: '27±1 Days',
    type: 'Shifting',
    moraCode: '3-55 Mora Approved',
    badge: 'MORA Approved: 3-55',
    description: 'Extended spiritual stay crafted for pilgrims seeking complete immersion and the blessed opportunity to fulfill 40 prayers in Madinah Munawwarah.',
    makkahHotel: 'Rotana Jabal Omar Makkah',
    makkahDistance: '150 Meters from Haram Courtyard',
    madinahHotel: '3/4-Star Markazia Hotels',
    madinahDistance: '250–300m from Roza Mubarak',
    tentCategory: 'Makteb-C Air-Conditioned Upgraded Camps',
    rates: {
      sharing: 1950000,
      triple: 2050000,
      double: 2150000,
    },
    highlights: [
      'Rotana Jabal Omar Makkah (150m)',
      '3/4-Star Markazia (250–300m Roza Mubarak)',
      'Fulfill 40 Prayers (Arbaeen) in Madinah',
      'Makteb-C Air-Conditioned Upgraded Camps',
      'Full Board (3 Daily Buffet Meals)',
      'Qurbani Included in Package',
    ],
  },
];
