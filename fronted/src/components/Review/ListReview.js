import React from 'react'
import {Rate} from 'antd'
import 'antd/dist/antd.css'

const ListReviews = ({ reviews }) => {
    return (
        <div class="reviews w-75">
            <h3>Other's Reviews:</h3>
            <hr />
            {reviews && reviews.map(review => (
                <div key={review._id} class="review-card my-3">
                    {console.log(review.rating)}
                    <Rate  value = {review.rating} disabled/>
                    <p class="review_user">by {review.name}</p>
                    <p class="review_comment">{review.comment}</p>

                    <hr />
                </div>
            ))}
        </div>
    )
}

export default ListReviews