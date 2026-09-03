export type Category = "electronics" | "clothing" | "home";

export interface Product {
  readonly id: string;
  readonly title: string;
  /** Mock price in USD. */
  readonly price: number;
  readonly description: string;
  readonly category: Category;
  readonly image: `/products/${string}`;
  readonly imageAlt: string;
  /** Rating on a scale of 0 to 5. */
  readonly rating: number;
  readonly featured: boolean;
}
