'use client'

import { getReviews } from '@/app/(public)/reviews/reviews.api'
import React from 'react'

export default function ReviewSection({ serviceId, reviewsService }: { serviceId: string, reviewsService: any[] }) {



  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Reviews</h2>
        <div className="space-y-4">
          {reviewsService.map((review) => (
            <div key={review.id} className="p-4 border rounded-md shadow-sm">
              <p className="font-medium">{review.author}</p>
              <p className="text-sm text-gray-600">{review.comment}</p>
              <p className="text-sm text-gray-500">Rating: {review.rating}/5</p>
              <p className="text-sm text-gray-500">Date: {new Date(review.createdAt).toLocaleDateString()}</p>

              <p className="text-sm text-gray-500">User ID: {review.userId}</p>


            </div>
          ))}
        </div>
      </div>
      <form
        className="space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.target as HTMLFormElement);
          const newReview = {
            author: formData.get("author") as string,
            comment: formData.get("comment") as string,
            rating: Number(formData.get("rating")),
            serviceId: Number(serviceId),
          };
          console.log("New Review Submitted: ", newReview);
          // Add logic to send newReview to the backend
        }}
      >
        <h3 className="text-lg font-medium">Leave a Review</h3>
        <div>
          <label className="block text-sm font-medium" htmlFor="author">
            Name
          </label>
          <input
            type="text"
            id="author"
            name="author"
            className="w-full p-2 border rounded-md"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium" htmlFor="comment">
            Comment
          </label>
          <textarea
            id="comment"
            name="comment"
            className="w-full p-2 border rounded-md"
            rows={4}
            required
          ></textarea>
        </div>
        <div>
          <label className="block text-sm font-medium" htmlFor="rating">
            Rating
          </label>
          <select
            id="rating"
            name="rating"
            className="w-full p-2 border rounded-md"
            required
          >
            <option value="">Select a rating</option>
            {[1, 2, 3, 4, 5].map((rating) => (
              <option key={rating} value={rating}>
                {rating}
              </option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
        >
          Submit Review
        </button>
      </form>
    </div>
  )
}

