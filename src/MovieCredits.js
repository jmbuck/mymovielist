import React from 'react';

import './MovieCredits.css';

const MovieCredits = ({cast, crew, fetched}) => 
{
    const image = document.querySelector('.person-image')
    const DISPLAYED_CREDITS = 25;
    
    const showPicture = (person) => {
      console.log(person)
      if(person.profile_path) {
        image.src=`https://image.tmdb.org/t/p/w300${person.profile_path}`
        image.style.display = 'block'
      }
    }

    if(!cast.length && !crew.length && fetched) {  
      return <div className="MovieCredits">No credits to display</div>
    } else {
      return(
        <div className="MovieCredits">
          {
            cast.length 
            ? (<div className="cast"> 
                <div>CAST</div>
                <ul>
                  {cast.slice(0, DISPLAYED_CREDITS).map((member, i) => {
                    if(member) {
                      return (
                        <li onMouseOver={() => {
                            showPicture(member)
                          } 
                        } onMouseOut={() => {image.style.display = 'none'}}
                        key={i}>
                          {member.name} as {member.character}
                        </li>
                      )
                    }
                    return <li key={i}></li>
                  })}
                </ul>
              </div>
              )
          : <div className="cast">No cast to display</div>
          }
          {
            crew.length 
            ? (
              <div className="crew"> 
                <div>CREW</div>
                <ul>
                  {crew.slice(0, DISPLAYED_CREDITS).map((member, i) => {
                    if(member) {
                      return (
                        <li onMouseOver={() => {
                            showPicture(member)
                          } 
                        } onMouseOut={() => {image.style.display = 'none'}}
                        key={i}>
                          {member.job} - {member.name}
                        </li>
                      )
                    }
                    return <li key={i}></li>
                  })}
                </ul>
              </div>
            )
            : <div className="crew">No crew to display</div>
          }        
        </div>
      )
    } 
}

export default MovieCredits;