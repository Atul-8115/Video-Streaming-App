const asyncHandler = (requestHabdler) => {
     (req,res,next) => {
        Promise.resolve(requestHabdler(req, res, next)).
        catch((err) => next(err))
     }
}

export {asyncHandler}

// const asyncHandler = () => {}
// const asyncHandler = (func) => () => {}
// const asyncHandler = (func) => async () => {}

// const asyncHandler = (fn) => async (req, res, next) => {
//     try {
//         await fn(req, res, next)
//     } catch (error) {
//         res.status(err.code || 5000).json({
//             success: false,
//             message: err.message
//         })
//     }
// }