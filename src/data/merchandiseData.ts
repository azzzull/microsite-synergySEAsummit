export interface MerchandiseItem {
  id: string;
  name: string;
  images: string[];
  description?: string;
  price?: string;
}

export const merchandiseItems: MerchandiseItem[] = [
  {
    id: 'tshirt',
    name: 'Synergy SEA Summit T-Shirt',
    images: ['/merchandise/t-shirt.jpg'],
    description: 'Official Synergy SEA Summit 2025 T-Shirt',
  },
  {
    id: 'waistbag',
    name: 'Synergy SEA Summit Waistbag',
    images: ['/merchandise/waistbag.jpg', '/merchandise/waistbag_kuning.jpg'],
    description: 'Stylish waistbag for your essentials',
  },
  {
    id: 'tumbler',
    name: 'Synergy SEA Summit Tumbler',
    images: ['/merchandise/tumbler.jpg', '/merchandise/tumbler_minum.jpg'],
    description: 'Keep your drinks hot or cold',
  },
  {
    id: 'hat',
    name: 'Synergy SEA Summit Hat',
    images: ['/merchandise/topi.jpg'],
    description: 'Stylish cap for sunny days',
  },
];

// Flatten all images for carousel
export const getAllMerchandiseImages = (): Array<{ image: string; name: string }> => {
  return merchandiseItems.flatMap(item => 
    item.images.map(image => ({
      image,
      name: item.name
    }))
  );
};
