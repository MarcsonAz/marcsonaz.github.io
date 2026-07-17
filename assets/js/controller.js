document.addEventListener('DOMContentLoaded', () => {

    // --- 1. Menu Mobile (Hamburger) ---
    const menuToggle = document.getElementById('menu-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', () => {
            navMenu.classList.toggle('is-active');
        });

        // Fechar menu ao clicar em um link
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('is-active');
            });
        });
    }

    // --- 2. Atualizar Ano no Footer ---
    const yearSpan = document.getElementById('current-year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // --- 3. Carregar Projetos via Fetch API ---
    const projectsGrid = document.getElementById('projects-grid');

    if (projectsGrid) {
        fetch('assets/data/projects.json')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Erro ao carregar projetos');
                }
                return response.json();
            })
            .then(projects => {
                renderProjects(projects);
            })
            .catch(error => {
                console.error(error);
                projectsGrid.innerHTML = '<p>Erro ao carregar a lista de projetos. Tente novamente mais tarde.</p>';
            });
    }

    // 4 - Carregar repositórios do GitHub
    const jsonUrl = 'assets/data/projetos-github.json';

    const loadingElement = document.getElementById("projetos-loading");
    const gridElement = document.getElementById("projetos-grid");

    fetch(jsonUrl)
        .then(response => {
            if (!response.ok) throw new Error("Não foi possível carregar os dados locais.");
            return response.json();
        })
        .then(projetos => {
            gridElement.innerHTML = "";

            projetos.forEach(repo => {
                const card = document.createElement("div");
                card.className = "projeto-card";

                card.innerHTML = `
                    <h3>${repo.name}</h3>
                    <p>${repo.description}</p>
                    <span class="linguagem-tag">${repo.language}</span>
                    <div class="card-links">
                        <a href="${repo.html_url}" target="_blank" rel="noopener">Ver Código</a>
                        ${repo.homepage ? `<a href="${repo.homepage}" target="_blank" rel="noopener">Live Demo</a>` : ''}
                    </div>
                `;

                gridElement.appendChild(card);
            });

            loadingElement.style.display = "none";
            gridElement.style.display = "grid";
        })
        .catch(error => {
            console.error(error);
            loadingElement.innerText = "Nenhum projeto encontrado no momento.";
        });


    function renderProjects(projects) {
        // Limpar o grid
        projectsGrid.innerHTML = '';

        projects.forEach(project => {
            const article = document.createElement('article');
            article.className = 'project-card';

            article.innerHTML = `
                <div class="project-image-wrapper">
                    <img src="${project.image}" alt="${project.title}">
                </div>
                <div class="project-content">
                    <h3 class="project-title">
                        <a href="${project.link}" target="_blank">${project.title}</a>
                    </h3>
                    <p class="project-desc">${project.description}</p>
                </div>
            `;

            projectsGrid.appendChild(article);
        });
    }
});

