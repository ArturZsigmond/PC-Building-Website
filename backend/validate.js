module.exports = function (req, res, next) {
    const { cpu, ram, gpu, case: pcCase, price } = req.body;

    if (!cpu || !ram || !gpu || !pcCase || typeof price !== 'number'){
        return res.status(400).json({error: 'Invalid build data'});
    }

    next();
}