export const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL 

// Define a type for review data
export interface ReviewData {
    rating: number;
    comment: string;
    serviceId: number;
    userId: string;
}

// CREATE review
export async function createReview(reviewData: ReviewData) {

    const res = await fetch(`${BACKEND_URL}/api/reviews`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(reviewData),
    })
    return await res.json(); // Return the backend response (with id, createdAt, etc)
}

// READ reviewS
export async function getReviews() {
    const res = await fetch(`${BACKEND_URL}/api/reviews`)
    const data = await res.json()
    return data
}
// READ review
export async function getReview(id:string) {
    const res = await fetch(`${BACKEND_URL}/api/reviews/${id}`)
    const data = await res.json()
    return await data
}

// UPDATE review
export async function updateReview(id: string, reviewData: ReviewData){
    const res = await fetch(`${BACKEND_URL}/api/reviews/${id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(reviewData),
    })
    return await res.json()
    
}

// DELETE review
export async function deleteReview(id: string){
    const res = await fetch(`${BACKEND_URL}/api/reviews/${id}`, {
        method: 'DELETE',
    })
    await res.json()
    // console.log(data)
    
}