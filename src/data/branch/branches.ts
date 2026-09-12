import type { Branch } from '@/domain/branch/types'

export const branches: Branch[] = [
  {
    id: 'bkk',
    name: 'Bangkok',
    nameTh: 'สาขาเสนานิคม (กรุงเทพฯ)',
    nameJp: 'バンコク・セナニコム店',
    subnameTh: 'เสนานิคม • พหลโยธิน 34',
    status: 'open',
    statusLabel: 'เปิดให้บริการปกติ',
    badgeLabel: 'Flagship Store',
    tagline: 'มัทฉะบาร์ใจกลางเสนานิคม ชงสดทุกแก้วด้วยความพิถีพิถัน',
    description:
      'สัมผัสมัทฉะสายพันธุ์เดี่ยว Single Cultivar จากเกียวโต ไอจิ ชิซูโอกะ และคาโกชิมะ พร้อม House Blends สูตรเฉพาะของทางร้าน',
    address: {
      short: 'Block Space 34, พหลโยธิน 34',
      full: 'Block Space 34, 1546 ซอยพหลโยธิน 34 แขวงเสนานิคม เขตจตุจักร กรุงเทพฯ 10900',
      province: 'กรุงเทพมหานคร',
      landmark: 'โครงการ Block Space 34 (มีที่จอดรถ)',
    },
    openingHours: '08:30 - 17:30 น. (เปิดบริการทุกวัน)',
    googleMapsUrl: 'https://maps.google.com/?q=Block+Space+34+Ryuu+Cafe',
    storefrontImage: {
      // Use the built-in illustration until the storefront photo is available.
      src: '',
      alt: 'RYUU Matcha Cafe Bangkok Storefront - Sena Nikhom',
      caption: 'RYUU Matcha Cafe @ Sena Nikhom, Bangkok',
    },
    features: [
      'Single Cultivar Bar',
      'House Blends & Fusion',
      'Dine-in & Takeaway',
      'Delivery Available',
    ],
    deliveryAvailable: true,
    deliveryNote: 'สั่งผ่าน GrabFood, LINE MAN, Robinhood, Shopee Food ได้ทุกวัน',
  },
  {
    id: 'korat',
    name: 'Korat',
    nameTh: 'สาขาโคราช (นครราชสีมา)',
    nameJp: 'コラート店・近日オープン',
    subnameTh: 'นครราชสีมา • เร็วๆ นี้',
    status: 'coming_soon',
    statusLabel: 'เร็วๆ นี้ (Coming Soon)',
    badgeLabel: 'New Branch',
    tagline: 'เตรียมพบกับมัทฉะแท้เกรดพิธีการ สาขาใหม่ที่โคราช',
    description:
      'ยกระดับประสบการณ์การดื่มชาเขียวมัทฉะแท้สู่ชาวโคราช ทั้ง Single Cultivar นำเข้าตรงจากญี่ปุ่น และเมนูซิกเนเจอร์สูตรพิเศษ',
    address: {
      short: 'อ.เมือง จ.นครราชสีมา',
      full: 'อำเภอเมืองนครราชสีมา จังหวัดนครราชสีมา (ประกาศตำแหน่งเร็วๆ นี้)',
      province: 'นครราชสีมา',
      landmark: 'ติดตามการเปิดตัวอย่างเป็นทางการ',
    },
    openingHours: 'เร็วๆ นี้ (Stay Tuned)',
    googleMapsUrl: 'https://maps.google.com/?q=Nakhon+Ratchasima',
    storefrontImage: {
      src: '/images/branches/korat-storefront.png',
      alt: 'RYUU Matcha Cafe Korat Interior - Nakhon Ratchasima',
      caption: 'RYUU Matcha Cafe @ Korat (Coming Soon)',
    },
    features: [
      'Ceremonial Matcha Bar',
      'Direct Sourced Teas',
      'Signature House Blends',
      'Grand Opening 2026',
    ],
    deliveryAvailable: false,
    deliveryNote: 'บริการเดลิเวอรีจะเปิดพร้อมกับวันเปิดสาขาอย่างเป็นทางการ',
  },
]
