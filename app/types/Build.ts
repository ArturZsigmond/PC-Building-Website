export type BuildData = {
  cpu: string;
  gpu: string;
  ram: string;
  case: string;
};

export type Build = BuildData & {
  id: string;
  price: number;
};
