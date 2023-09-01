export interface ScreenFeedItem {
  ContentId: string;
  User: {
    Id: string;
    Username: string;
    Name: string;
    ProfileImageUrlSmall: string | null;
    ProfileImageUrl: string;
  };
  Popularity: {
    Retweets: number;
    Favorites: number;
    Likes: number;
    Comments:number;
  };
  Images: Array<{
    Url: string;
    Width: number;
    Height: number;
  }>;
  Content: string;
  Provider: number;
  ProviderIcon: string;
  CreatedDate: string;
  DisplayTime: string;
  IsRetweet: boolean;
  IsSelected: boolean;
}

export interface ScreenFeedStatus {
  Code: number;
  Message: string;
  Type: string;
}

export interface SocialScreenFeedResponse {
  Items: ScreenFeedItem[];
  Status: ScreenFeedStatus;
}