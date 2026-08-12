import { CassetteTape, RadioStation, ShopMemory } from '../types';

export const INITIAL_CASSETTES: CassetteTape[] = [
  {
    id: 'tape-1',
    title: 'Kumar & Alka: 90s Romance Collection',
    artist: 'Kumar Sanu, Alka Yagnik & Nadeem-Shravan',
    era: 'Mid 90s',
    genre: '90s Romance',
    releaseYear: 1994,
    brand: 'Super Cassettes (T-Series)',
    shellColor: 'gold',
    price: '₹35.00',
    youtubeId: 'PL-kHQc5zhDgJ3Ajo_77236e3ANRcXRMrZ', // 90s Romance Jukebox
    sideA: [
      '1. Mera Dil Bhi Kitna Pagal Hai',
      '2. Sochenge Tumhe Pyaar Karein',
      '3. Tumhein Dekhein Meri Aankhein',
      '4. Kitna Pyara Tujhe Rab Ne Banaya'
    ],
    sideB: [
      '5. Tumse Milne Ki Tamanna Hai',
      '6. Ek Ladki Ko Dekha To Aisa Laga',
      '7. Dil Ka Aalam Main Kya Batau'
    ],
    notes: 'Recorded onto T-Series Gold C-90 tape from Vividh Bharati broadcast. Favorite track: Side A #1!'
  },
  {
    id: 'tape-2',
    title: 'Indipop Revolution 1997',
    artist: 'Alisha Chinai, Lucky Ali, Euphoria, Silk Route',
    era: 'Late 90s',
    genre: 'Indipop',
    releaseYear: 1997,
    brand: 'TDK D-90',
    shellColor: 'clear',
    price: '$2.99',
    youtubeId: 'PL-kHQc5zhDgJ3Ajo_77236e3ANRcXRMrZ', // Indipop Hits
    sideA: [
      '1. Made in India - Alisha Chinai',
      '2. O Sanam - Lucky Ali',
      '3. Dhoom Pichak Dhoom - Euphoria',
      '4. Dooba Dooba - Silk Route'
    ],
    sideB: [
      '5. Tanha Dil - Shaan',
      '6. Purani Jeans - Ali Haider',
      '7. Deewane To Deewane Hain - Shweta'
    ],
    notes: 'Mixtape recorded live off Channel V & MTV Countdown! Maximum bass!'
  },
  {
    id: 'tape-3',
    title: 'Bollywood Blockbusters 1992-1995',
    artist: 'Various Artists / T-Series Super Hits',
    era: 'Early-Mid 90s',
    genre: 'Bollywood Gold',
    releaseYear: 1993,
    brand: 'Super Cassettes (T-Series)',
    shellColor: 'red',
    price: '₹30.00',
    youtubeId: 'PL-kHQc5zhDgJ3Ajo_77236e3ANRcXRMrZ', // 90s Bollywood Hits
    sideA: [
      '1. Pehla Nasha - Jo Jeeta Wohi Sikandar',
      '2. Didi Tera Deewana - HAHK',
      '3. Chura Ke Dil Mera - Main Khiladi Tu Anari',
      '4. Tu Cheez Badi Hai Mast Mast'
    ],
    sideB: [
      '5. Tip Tip Barsa Paani - Mohra',
      '6. Yeh Kaali Kaali Aankhen - Baazigar',
      '7. Jadu Teri Nazar - Darr'
    ],
    notes: 'Super Cassettes Dolby B NR. Demagnetized & cleaned tape heads on May 12, 1995.'
  },
  {
    id: 'tape-4',
    title: 'MTV Unplugged & Alternative 90s',
    artist: 'Nirvana, R.E.M., Oasis, The Cranberries',
    era: 'Mid 90s',
    genre: 'Western Hits',
    releaseYear: 1995,
    brand: 'Goldstar Chrome',
    shellColor: 'black',
    price: '$3.50',
    youtubeId: 'PL-kHQc5zhDgJ3Ajo_77236e3ANRcXRMrZ', // 90s Rock Unplugged
    sideA: [
      '1. Smells Like Teen Spirit - Nirvana',
      '2. Wonderwall - Oasis',
      '3. Losing My Religion - R.E.M.',
      '4. Zombie - The Cranberries'
    ],
    sideB: [
      '5. Black Hole Sun - Soundgarden',
      '6. Creep - Radiohead',
      '7. November Rain - Guns N Roses'
    ],
    notes: 'Dubbed directly from CD using high-bias Chrome Tape position. Pure 90s guitar magic.'
  },
  {
    id: 'tape-5',
    title: 'Ghazal Nights: Unforgettable Melodies',
    artist: 'Jagjit Singh, Chitra Singh & Pankaj Udhas',
    era: 'Early 90s',
    genre: 'Ghazals & Unplugged',
    releaseYear: 1991,
    brand: 'Maxell XL-II',
    shellColor: 'blue',
    price: '₹40.00',
    youtubeId: 'PL-kHQc5zhDgJ3Ajo_77236e3ANRcXRMrZ-550', // Jagjit Singh Ghazals
    sideA: [
      '1. Jhuki Jhuki Si Nazar',
      '2. Tumko Dekha To Yeh Khayal Aaya',
      '3. Hoshwalon Ko Khabar Kya',
      '4. Chitthi Aai Hai - Pankaj Udhas'
    ],
    sideB: [
      '5. Pyar Ka Pehla Khat',
      '6. Tera Chehra Kitna Suhana',
      '7. Hazaron Khwahishein Aisi'
    ],
    notes: 'Late night shortwave recording. Best listened to with warm chai on a rainy evening.'
  },
  {
    id: 'tape-6',
    title: 'Eurodance & Dance Party 1996',
    artist: 'Vengaboys, Ace of Base, Aqua, Hadaway',
    era: 'Late 90s',
    genre: 'Western Hits',
    releaseYear: 1996,
    brand: 'Sony HF-90',
    shellColor: 'clear',
    price: '$2.50',
    youtubeId: 'PL-kHQc5zhDgJ3Ajo_77236e3ANRcXRMrZ', // 90s Eurodance Party
    sideA: [
      '1. All That She Wants - Ace of Base',
      '2. What Is Love - Haddaway',
      '3. Barbie Girl - Aqua',
      '4. Rhythm Is a Dancer - Snap!'
    ],
    sideB: [
      '5. We Like to Party! - Vengaboys',
      '6. Coco Jamboo - Mr. President',
      '7. Scatman - Scatman John'
    ],
    notes: 'Boombox party cassette! Extra treble and bass boosted.'
  }
];

export const RADIO_STATIONS: RadioStation[] = [
  {
    id: 'radio-1',
    frequency: 89.1,
    callSign: '89.1 FM',
    name: 'Vividh Bharati 90s Nostalgia',
    genre: 'Bollywood Gold',
    description: 'Live broadcast of classic 90s Hindi cinema melodies and listener letters.',
    youtubeId: '99_4T6iS_2E',
    location: 'Mumbai Broadcast Hub',
    signalStrength: 'Strong',
    band: 'FM'
  },
  {
    id: 'radio-2',
    frequency: 93.5,
    callSign: '93.5 FM',
    name: 'Red Retro 90s Express',
    genre: '90s Romance',
    description: 'Non-stop 90s love songs with late-night RJ banter and poetry.',
    youtubeId: 'PL-kHQc5zhDgJ3Ajo_77236e3ANRcXRMrZ',
    location: 'Delhi Studio 1',
    signalStrength: 'Strong',
    band: 'FM'
  },
  {
    id: 'radio-3',
    frequency: 98.3,
    callSign: '98.3 FM',
    name: 'Radio Mirchi Indipop Special',
    genre: 'Indipop',
    description: 'The golden age of MTV India and Channel V pop revolution.',
    youtubeId: 'PL-kHQc5zhDgJ3Ajo_77236e3ANRcXRMrZ',
    location: 'Bangalore Tower',
    signalStrength: 'Strong',
    band: 'FM'
  },
  {
    id: 'radio-4',
    frequency: 101.2,
    callSign: '101.2 FM',
    name: 'Ghazal & Unplugged Evening',
    genre: 'Ghazals & Unplugged',
    description: 'Soulful acoustic ghazals, sitar interludes, and poetry.',
    youtubeId: '2oT8K5P-550',
    location: 'Kolkata Station',
    signalStrength: 'Moderate',
    band: 'FM'
  },
  {
    id: 'radio-5',
    frequency: 104.0,
    callSign: '104.0 FM',
    name: 'Planet 90s Rock & Alternative',
    genre: 'Western Hits',
    description: 'Grunge, Britpop, and MTV Unplugged requests from around the globe.',
    youtubeId: 'hTWKbfoikeg',
    location: 'London Relay',
    signalStrength: 'Moderate',
    band: 'FM'
  },
  {
    id: 'radio-6',
    frequency: 108.4,
    callSign: '108.4 FM',
    name: 'Aakashvani Shortwave World Service',
    genre: 'Bollywood Gold',
    description: 'International shortwave broadcast with vintage tuning tone.',
    youtubeId: 'HEXWRTEbj1I',
    location: 'National Shortwave Transmitter',
    signalStrength: 'Faint',
    band: 'SW'
  }
];

export const SHOP_MEMORIES: ShopMemory[] = [
  {
    id: 'mem-1',
    speaker: 'Shop Clerk Rajesh',
    quote: 'Pro-tip: If your cassette tape ever gets tangled in your boombox, use the HB wooden pencil resting on the glass counter to wind it back up!',
    year: '1995',
    tag: 'TAPE CARE'
  },
  {
    id: 'mem-2',
    speaker: 'Vividh Bharati Announcer',
    quote: 'Namaskar! Next up on Vividh Bharati 89.1 FM: Listener request from Kanpur for Side A of the 1994 Kumar Sanu Mixtape...',
    year: '1996',
    tag: 'RADIO ANNOUNCEMENT'
  },
  {
    id: 'mem-3',
    speaker: 'Aakashvani 108.4 FM',
    quote: 'Shortwave radio update: Clear weather signals tonight across the subcontinent. Tune your analog dial gently between 88 and 108 MHz.',
    year: '1993',
    tag: 'SHORTWAVE'
  },
  {
    id: 'mem-4',
    speaker: 'Super Cassettes / T-Series Sticker',
    quote: 'Original Super Cassettes Dolby B noise reduction tape. Clean tape head with isopropyl alcohol every 10 hours of listening.',
    year: '1994',
    tag: 'AUTHENTIC HARDWARE'
  },
  {
    id: 'mem-5',
    speaker: 'Late Night Shop Customer',
    quote: 'Nothing compares to writing track names on the J-Card in fountain pen ink while listening to Indipop on a rainy monsoon night.',
    year: '1997',
    tag: 'NOSTALGIA'
  }
];
