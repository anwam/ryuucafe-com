export type Product = {
  available: boolean;
  description: string;
  id: string;
  name: string;
  onSale: boolean;
  onlyDelivery: boolean;
  price: number;
  salePrice: number;
  bestSeller?: boolean;
  shelfOrder?: number;
  coverImage: {
    blurhash: string;
    thumbhash: string;
    responsiveImage: {
      src: string;
      srcSet: string;
      sizes: string;
      width: number;
      height: number;
    };
  };
};
