const  ToastOK = () => {
    return (
        <div >
            <img src="/ok.gif" 
            alt="Sucesso"
            style={{
                display: "block",
                transform: "translate(-50%, -50%)",
                maxWidth: "25vw",
                maxHeight: "25vh",
                position:"absolute",
                top:"50%",
                left:"50%",
                zIndex:"1000"
              }}
               />
           
        </div>
    );
};

export default ToastOK;