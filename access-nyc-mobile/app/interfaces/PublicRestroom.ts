export interface PublicRestroom {
  name: string;
  status: string;
  hours: string;
  isAccessible: boolean;
  isFullyAccessible: boolean;
  isPartiallyAccessible: boolean;
  restroomType: string;
  hasChangingStations: boolean;
  url: string;
  latitude: number;
  longitude: number;
}
