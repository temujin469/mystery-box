type Box = {
  id: string;
  name: string;
  cost: number;
  price: number;
  description: string;
  available_from: string;
  available_to: string;
  is_featured: boolean;
  created_at: string;
  image_url:string
};

type Item = {
  id: string;
  name: string;
  description: string;
  image_url: string;
  price: number;
  drop_rate: number;
};
