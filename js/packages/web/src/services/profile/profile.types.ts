export type ProfileOwnerRequest = {
  ownerId: string;
};

export type ProfileByIDRequest = {
  profileId: string;
};

// TODO: move to context class, as soon as create one
export type Profile = {
  profileId: string;
  ownerId: string;
  name: string;
  email: string;
  phone: string;
  bio: string;
  imageUrl: string;
  banner_url: string;
  on_sale: string[];
  collectible: string[];
  created: string[];
  liked: string[];
  activity: string[];
  followers: number;
  following: number;
  description: string;
  member_since: string;
  createdAt: Date;
  updatedAt: Date;
};
