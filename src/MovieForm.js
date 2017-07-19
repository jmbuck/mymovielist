import React from 'react'

import './MovieForm.css'

const MovieForm = ({ category, movie, handleSubmit, edit, redir, history, setAdded}) => 
{
    let today = new Date()
    let dd = today.getDate()
    let mm = today.getMonth()+1
    let yyyy = today.getFullYear()
    if(dd < 10) dd = '0' + dd
    if(mm < 10) mm = '0' + mm
    today = `${yyyy}-${mm}-${dd}`

    return (
        <form className="MovieForm" onSubmit={(ev) => {
            handleSubmit(movie, ev, edit, false, redir, category)
            if(!edit) setAdded(true)
        }}>
            <div className="fields">
                <div className="category">
                    <input type="radio" name="category" value="completed" defaultChecked={category === 'completed'}/>Completed<br/>
                    <input type="radio" name="category" value="ptw" defaultChecked={category === 'ptw'}/>Plan to Watch<br/>
                    <input type="radio" name="category" value="dropped" defaultChecked={category === 'dropped'}/>Dropped<br/>
                </div>
                <div className="optional">
                    <div className="date">
                    Date watched: 
                    <a onClick={() => {
                        document.querySelector('.optional input').value = today
                        }}>Insert Today
                    </a>
                    <input type="date" name="date" defaultValue={movie.watched_date} max={today}/>
                    </div>
                    <select name="score" defaultValue={movie.score}>
                        <option value="">-- Score --</option>
                        <option value="10">10</option>
                        <option value="9">9</option>
                        <option value="8">8</option>
                        <option value="7">7</option>
                        <option value="6">6</option>
                        <option value="5">5</option>
                        <option value="4">4</option>
                        <option value="3">3</option>
                        <option value="2">2</option>
                        <option value="1">1</option>
                    </select>
                    Rewatches: <input type="text" name="rewatches" defaultValue={movie.rewatches} placeholder="# of rewatches"/>
                </div>
            </div>
            <div className="stacked-for-small radius button-group">
                <button className="button success" type="submit">{edit ? 'Confirm' : 'Add'}</button>
                <button className="button alert" type="button" onClick={() => {
                    history.push(redir)
                }}>Cancel</button>
            </div>
        </form>
    )
}

export default MovieForm