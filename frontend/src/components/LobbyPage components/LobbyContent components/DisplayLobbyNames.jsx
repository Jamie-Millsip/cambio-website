import "../../../pages/Body.css"

function DisplayLobbyNames({messageArray}){


    return(
        <>
        {Array.isArray(messageArray) && messageArray.map((name)=>{
            if (name.ready){
                return (
                    <p className = {"player ready-player body-text"}key = {name.nickname}> {name.nickname}</p>
                )
            }
            else{
                return (
                    <p className = {"player unready-player body-text"}key = {name.nickname}> {name.nickname}</p>
                )
            }
        })}
        </>
    )
}

export default DisplayLobbyNames;