import { useState } from "react";
import './StarRating.scss';

const StarRating = (props: {getValue: any}) => {  
    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);

    const getRating = (index: number) => {
        setRating(index);
        props.getValue(index);
    }
    return (
        <div className="star-rating">
            {[...Array(5)].map((star, index) => {
                index += 1;        
                return (
                    <button
                        type="button"
                        key={index}
                        onClick={() => getRating(index)}
                        onMouseEnter={() => setHover(index)}
                        onMouseLeave={() => setHover(rating)}
                    >
                        <i className={index <= hover ? "fa-solid fa-star" : "fa-regular fa-star"}></i>  
                    </button>            
                );
            })}
        </div>
    );
};

export default StarRating;