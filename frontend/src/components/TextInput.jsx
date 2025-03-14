import "../pages/Body.css";



function TextInput({setValue, value, placeholder, cssClass}) {


    return(
        <input
            type = "text" 
            placeholder= {placeholder} 
            value = {value} onChange = {(event) => setValue(event.target.value)} 
            className={`textbox ${cssClass}`}
            />

    )
}

export default TextInput;