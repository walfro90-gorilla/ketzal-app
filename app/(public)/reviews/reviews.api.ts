export const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000'


    // CREATE review
    export async function createReview(reviewData: any){

        const res = await fetch(`${BACKEND_URL}/api/reviews`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(reviewData),
        })
        await res.json()
        // console.log(data)
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
export async function updateReview(id: string, reviewData: any){
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