const axios = require('axios');
class GitHub {
    async stalk(user) {
        try {
            const res = await axios.get(`https://api.github.com/users/${user}`);
            return res.data;
        } catch (e) { return null; }
    }
}
module.exports = new GitHub();
