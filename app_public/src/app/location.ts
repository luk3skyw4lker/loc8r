export class Review {
  author: string;
  rating: number;
  reviewText: string;
}

class OpeningTimes {
  days: string;
  opening: string;
  closing: string;
  closed: boolean;
}

export class Location {
  id: string;
  name: string;
  distance: number;
  address: string;
  rating: number;
  facilities: string[];
  reviews: Review[];
  coords: {
    type: string;
    coordinates: number[];
  };
  openingTimes: OpeningTimes[];
}
