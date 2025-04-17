import mongoose from 'mongoose';

const username = 'audioreelio';
const password = 'f9QRphWs5Yo1Tp18';

var dbUrl = 'mongodb+srv://'+username+':'+password+'@audioreelcluster.2i0bh.mongodb.net/?retryWrites=true&w=majority&appName=audioreelCluster';

const connectToMongo = ()=>{
    mongoose.connect(dbUrl).then()
    .catch((err) => { console.error(err); });
}

export default connectToMongo;