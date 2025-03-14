import { useNavigate } from "react-router-dom";
import "../../../pages/Body.css"

function ErrorView(){
    const navigate = useNavigate();

    const handleReturnClick = () =>{
        navigate(`/`);
        
    }

    return(
        <>
        <p className="title">ERROR</p>
        <p>lobby doesnt exist</p>
        <button onClick = {handleReturnClick}>Return to Home</button>
        </>
    )
}

export default ErrorView;