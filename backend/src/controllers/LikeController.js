const Dev = require('../models/Dev');


module.exports = {
    async store(req, res) {
//        console.log(req.params.devId);
 //       console.log(req.headers.user);
        console.log(req.io, req.connectedUsers);

        const { user } = req.headers;
        const { devId } = req.params;
        

        const loggedDev = await Dev.findById(user);
        const targetDev = await Dev.findById(devId);

        if (!targetDev) {
            return res.status(400).json({ error: 'Dev not existis' });
        }

        // permitir apenas um like / dislike por user 
        // se tiver como like e clicar no dislike deve retirar do like e colocar somente no dislike e vice e versa
        
        if (targetDev.likes.includes(loggedDev._id)) {
            const loggedSocket = req.connectedUsers[user];
            const targetSocket = req.connectedUsers[devId];

            if (loggedSocket) {
                req.io.to(loggedSocket).emit('match', targetDev);
            }
            
            if (targetSocket) {
                req.io.to(targetSocket).emit('match', loggedDev);
            }



            
            console.log('DEU MATCH')
        }
        loggedDev.likes.push(targetDev._id);

        await loggedDev.save();
        
        return res.json(loggedDev);
    }
};