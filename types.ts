export interface PricingPlan {
  id: string;
  title: string;
  basePrice: number;
  description: string;
  features: string[];
  recommended?: boolean;
}

export type DeliveryMode = 'standard' | 'express';

export interface Testimonial {
  id: number;
  name: string;
  partner: string;
  quote: string;
  image: string;
}
