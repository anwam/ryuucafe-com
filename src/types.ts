export type Product = {
  available: boolean;
  description: string;
  id: string;
  name: string;
  onSale: boolean;
  onlyDelivery: boolean;
  price: number;
  salePrice: number;
  topSeller?: boolean;
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
