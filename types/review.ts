export interface Review {
  id: string;
  userId: string;
  rating: number;
  comment: string;
  createdAt: string | Date;
  serviceId: number;
}

export interface User {
  id: string;
  image: string;
  name: string;
}

export interface ReviewSectionProps {
  serviceId: string;
  reviewsService: Review[];
  users: User[];
  session: any; // You may want to type this more strictly if you have a session type
}
