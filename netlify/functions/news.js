
export const handler = async (event) => {
    const API_KEY = process.env.VITE_NEWS_API_KEY || process.env.NEWS_API_KEY;
    
    const domains = 'omelete.com.br,adorocinema.com,jovemnerd.com.br,ign.com,collider.com,variety.com';
    const query = '(filme OR série OR movie OR series OR anime OR cinema)';
    
    const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&domains=${domains}&sortBy=publishedAt&apiKey=${API_KEY}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        return {
            statusCode: response.status,
            headers: {
                "Access-Control-Allow-Origin": "*", // Evita problemas de CORS no dev local, caso usado direto
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        };
    } catch (error) {
        console.error("Erro na Netlify Function de News:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Failed fetching news" })
        };
    }
};