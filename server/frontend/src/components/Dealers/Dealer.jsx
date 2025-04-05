import React, { useState,useEffect } from 'react';
import { useParams } from 'react-router-dom';
import "./Dealers.css";
import "../assets/style.css";
import positive_icon from "../assets/positive.png"
import neutral_icon from "../assets/neutral.png"
import negative_icon from "../assets/negative.png"
import review_icon from "../assets/reviewbutton.png"
import Header from '../Header/Header';

const Dealer = () => {


  const [dealer, setDealer] = useState({});
  const [reviews, setReviews] = useState([]);
  const [unreviewed, setUnreviewed] = useState(false);
  const [postReview, setPostReview] = useState(<></>)

  let curr_url = window.location.href;
  let root_url = "https://randykrouth-3030.theiadockernext-1-labs-prod-theiak8s-4-tor01.proxy.cognitiveclass.ai/";
  let params = useParams();
  let id =params.id;
  let dealer_url = root_url+`fetchDealer/${id}`;
  let reviews_url = `https://randykrouth-3030.theiadockernext-1-labs-prod-theiak8s-4-tor01.proxy.cognitiveclass.ai/fetchReviews/dealer/${id}`;
  let post_review = `https://randykrouth-8000.theiadockernext-1-labs-prod-theiak8s-4-tor01.proxy.cognitiveclass.ai/postreview/${id}`;
  
  const get_dealer = async ()=>{
    const res = await fetch(dealer_url, {
      method: "GET"
    });
    const retobj = await res.json();

    // console.log(retobj);

    if(retobj) {
      // let dealerobjs = Array.from(retobj.dealer)
      setDealer(retobj)
    }
  }

  const get_reviews = async ()=>{
    const res = await fetch(reviews_url, {
      method: "GET"
    });
    const retobj = await res.json();
    
    if(retobj) {
        setReviews(retobj)
    }
    else {
        setUnreviewed(true);
      }
  }

  const senti_icon = (sentiment)=>{
    let icon = sentiment === "positive"?positive_icon:sentiment==="negative"?negative_icon:neutral_icon;
    return icon;
  }

  useEffect(() => {
    get_dealer();
    get_reviews();
    if(sessionStorage.getItem("username")) {
      setPostReview(<a href={post_review}><img src={review_icon} style={{width:'10%',marginLeft:'10px',marginTop:'10px'}} alt='Post Review'/></a>)

      
    }
  },[]);  


return(
  <div style={{margin:"20px"}}>
      <Header/>
      <div style={{marginTop:"10px"}}>
      <h1 style={{color:"grey"}}>{dealer.full_name}{postReview}</h1>
      <h4  style={{color:"grey"}}>{dealer['city']},{dealer['address']}, Zip - {dealer['zip']}, {dealer['state']} </h4>
      </div>
      <div class="reviews_panel">
      {reviews ? (
        reviews.map(review => (
            <div className='review_panel' key={review._id}>
            <img src={senti_icon(review.sentiment)} className="emotion_icon" alt='Sentiment' />
            <div className='review'>{review.review}</div>
            <div className="reviewer">{review.name} {review.car_make} {review.car_model} {review.car_year}</div>
            </div>
        ))
        ) : null}
    </div>  
  </div>
)
}

export default Dealer;
