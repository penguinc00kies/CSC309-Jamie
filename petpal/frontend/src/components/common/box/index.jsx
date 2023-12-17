import './style.css'

function Box({type, children}) {
    return(
        <>
            <div className={type}>
                {children}
            </div>
        </>
    )
}

export default Box;