const axios = require('axios');
class Instagram {
    async stalk(user) {
        try {
            const res = await axios.get(`https://www.instagram.com/api/v1/users/web_profile_info/`, {
                params: { username: user },
                headers: { 'X-IG-App-ID': '936619743392459', 'User-Agent': 'Mozilla/5.0' }
            });
            const u = res.data.data.user;
            return {
                username: u.username,
                full_name: u.full_name,
                bio: u.biography,
                followers: u.edge_followed_by.count,
                following: u.edge_follow.count,
                posts: u.edge_owner_to_timeline_media.count,
                private: u.is_private,
                verified: u.is_verified,
                profile_pic: u.profile_pic_url_hd
            };
        } catch (e) { return null; }
    }
}
module.exports = new Instagram();
