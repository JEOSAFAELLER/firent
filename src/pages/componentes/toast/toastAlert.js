const ToastAlert = ({ message }) => {
    return (
        <div >
            
            <span  
            style={{
                display: "block",
        transform: "translate(-50%, -50%)",
        position: "absolute",
        top: "50%",
        left: "50%",
        zIndex: "1000",
        backgroundColor:"#3f826d",
        color:   "#f2d0a4", 
        borderRadius:"10px",
        boxShadow: "4px 4px 10px rgba(0, 0, 0, 0.5)",
        
        fontFamily:"Verdana , sans-serif",
        fontWeight:"bolder",
        padding:"20px"
              }}>{message}</span>
            
        </div>
    );
};
export default ToastAlert

