import React from "react";

function WinnerCard(props) {
//    console.log(props.usCard.fields.lastWin)
    return(
        <div className="winner_card">
            
            <img className='ava' src={props.usCard.ava.length < 150 ? props.usCard.ava + '&quality=95&crop=492,76,602,602&ava=1' : props.usCard.ava}/>
            <h4 className='winner_card__name'>{props.usCard.surname+' '+props.usCard.firstname}</h4>
			<p>{props.usCard.lastresult}</p>
			<img className='coins' src={props.gold} alt="coins"/>
        </div>
        
    )

}

export default WinnerCard;