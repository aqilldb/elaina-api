class Anilist {
    constructor() {
        this.url = 'https://graphql.anilist.co';
        this.query = `
        query ($search: String) {
          Page(page: 1, perPage: 5) {
            media(search: $search, type: ANIME, sort: POPULARITY_DESC) {
              id
              title { romaji english native }
              siteUrl
              description(asHtml: false)
              bannerImage
              coverImage { extraLarge color }
              episodes duration status format genres averageScore popularity season seasonYear
              startDate { year month day }
              nextAiringEpisode { episode timeUntilAiring airingAt }
              trailer { id site thumbnail }
              rankings { rank type context allTime year }
              relations { edges { relationType node { id title { romaji } format status siteUrl coverImage { large medium } } } }
              characters(sort: [ROLE, RELEVANCE], perPage: 15) {
                edges {
                  role
                  node { id name { full } siteUrl image { large medium } }
                  voiceActors(language: JAPANESE, sort: RELEVANCE) { id name { full } siteUrl image { large medium } }
                }
              }
              staff(sort: RELEVANCE, perPage: 8) {
                edges { role node { id name { full } siteUrl image { large medium } } }
              }
            }
          }
        }`;
    }

    async search(name) {
        const options = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
            body: JSON.stringify({ query: this.query, variables: { search: name } })
        };
        const response = await fetch(this.url, options);
        const data = await response.json();
        if (data.errors) throw new Error(data.errors[0].message);
        return data.data.Page.media;
    }
}
module.exports = new Anilist();
