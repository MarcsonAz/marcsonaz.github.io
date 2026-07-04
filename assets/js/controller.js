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
