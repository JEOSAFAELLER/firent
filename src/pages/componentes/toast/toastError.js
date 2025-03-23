const ToastError = () => {
    return (
        <div >
            <img src="/error.gif" 
            alt="Erro"
            style={{
                display: "block",
                transform: "translate(-50%, -50%)",
                maxWidth: "25vw",
                maxHeight: "25vh",
                position:"absolute",
                top:"25%",
                left:"50%",
                zIndex:"1000"
              }}
            />
           
        </div>
    );
};

export default ToastError