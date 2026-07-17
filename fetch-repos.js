// fetch-repos.js
const fs = require('fs');

async function fetchRepos() {
    const username = "MarcsonAz";
    const apiUrl = `https://api.github.com/users/${username}/repos?sort=updated&per_page=15`;

    try {
        console.log("Buscando dados na API do GitHub...");
        const response = await fetch(apiUrl);

        if (!response.ok) {
            throw new Error(`Erro na API: HTTP ${response.status}`);
        }

        const data = await response.json();

        // Filtra repositórios que não são forks e pega os 6 mais recentes
        const projetosOriginais = data.filter(repo => !repo.fork).slice(0, 6);

        // Mapeia apenas os dados necessários para o frontend ficar mais leve
        const portfolioData = projetosOriginais.map(repo => ({
            name: repo.name.replace(/-/g, ' ').toUpperCase(),
            description: repo.description || "Descrição não disponível.",
            language: repo.language || "Diversos",
            html_url: repo.html_url,
            homepage: repo.homepage
        }));

        // Escreve os dados no arquivo projetos.json
        fs.writeFileSync('projetos.json', JSON.stringify(portfolioData, null, 2));
        console.log("Arquivo projetos.json gerado com sucesso!");

    } catch (error) {
        console.error("Erro ao gerar projetos.json:", error);
        process.exit(1); // Encerra o script com erro para falhar a Action se algo der errado
    }
}

fetchRepos();