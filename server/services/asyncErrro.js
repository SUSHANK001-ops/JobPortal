

export const asyncError = (fn)=>{ // higher order function`
    return(req, res)=>{
        fn(req, res).catch((err)=>{
            res.status(500).json({
                message: "Server Error",
                error: err.message
            })
        })
    }
}