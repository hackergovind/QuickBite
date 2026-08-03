import React from 'react'

export function RestaurantCardSkeleton() {
  return (
    <div className="card animate-pulse">
      <div className="aspect-[4/3] bg-gray-200" />
      <div className="p-4 space-y-3">
        <div className="flex justify-between">
          <div className="h-5 bg-gray-200 rounded w-2/3" />
          <div className="h-5 bg-gray-200 rounded w-12" />
        </div>
        <div className="h-4 bg-gray-200 rounded w-3/4" />
        <div className="flex justify-between pt-2">
          <div className="h-4 bg-gray-200 rounded w-20" />
          <div className="h-4 bg-gray-200 rounded w-16" />
        </div>
      </div>
    </div>
  )
}

export function FoodCardSkeleton() {
  return (
    <div className="card animate-pulse">
      <div className="aspect-square bg-gray-200" />
      <div className="p-4 space-y-2">
        <div className="h-5 bg-gray-200 rounded w-3/4" />
        <div className="flex justify-between">
          <div className="h-4 bg-gray-200 rounded w-16" />
          <div className="h-4 bg-gray-200 rounded w-12" />
        </div>
        <div className="h-8 bg-gray-200 rounded w-full mt-2" />
      </div>
    </div>
  )
}

export function HeroSkeleton() {
  return (
    <div className="animate-pulse py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12">
          <div className="space-y-6">
            <div className="h-8 bg-gray-200 rounded w-48" />
            <div className="h-16 bg-gray-200 rounded w-full" />
            <div className="h-16 bg-gray-200 rounded w-3/4" />
            <div className="h-6 bg-gray-200 rounded w-full" />
            <div className="h-6 bg-gray-200 rounded w-2/3" />
            <div className="flex gap-4">
              <div className="h-12 bg-gray-200 rounded w-32" />
              <div className="h-12 bg-gray-200 rounded w-32" />
            </div>
          </div>
          <div className="h-96 bg-gray-200 rounded-3xl" />
        </div>
      </div>
    </div>
  )
}

export default function LoadingSkeleton({ type = 'restaurant', count = 4 }) {
  const SkeletonComponent = type === 'food' ? FoodCardSkeleton : RestaurantCardSkeleton

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {[...Array(count)].map((_, i) => (
        <SkeletonComponent key={i} />
      ))}
    </div>
  )
}