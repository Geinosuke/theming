import axios from 'axios'

const env = process.env.NODE_ENV;
const prodApi = 'mongodb://heroku_sz9cn5j3:h0p8f82h8fkobm4vvkeubl2rr8@ds261570.mlab.com:61570/heroku_sz9cn5j3';
const devApi = 'http://localhost:3000/api/';
let usedUrl;
if(env === 'production')
  usedUrl = prodApi;
else
  usedUrl = devApi;
export default() => {
  return axios.create({
    baseURL: usedUrl
  })
}
