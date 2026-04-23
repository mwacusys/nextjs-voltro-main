export type RatingDistributionItem = {
  rating: number
  count: number
}

export function normalizeRatingDistribution(data?: {
  [x: string]: number
}): RatingDistributionItem[] {
  return Object.entries(data || {}).map(([rating, count]) => ({
    rating: Number(rating),
    count: Number(count),
  }))
}
