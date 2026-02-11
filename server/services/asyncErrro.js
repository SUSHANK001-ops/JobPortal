

const asyncError = (fn)=>{ // higher order function`
    return(req, res, next)=>{
        fn(req, res, next).catch((err)=>{
            res.status(500).json({
                message: "Server Error",
                error: err.message
            })
        })
    }
}

module.exports = { asyncError }