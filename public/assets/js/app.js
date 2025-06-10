// Carregar e exibir filmes na home-page
document.addEventListener("DOMContentLoaded", async () => {
    try {
        const filmes = await carregarFilmes();
        console.log('Filmes carregados:', filmes);

        renderizarFilmes(filmes);
        renderizarCarrossel(filmes);
        
        document.getElementById('formPesquisa')?.addEventListener('submit', pesquisar);
        document.getElementById('campoBusca')?.addEventListener('input', pesquisarEmTempoReal);
        
    } catch (error) {
        console.error('Erro na inicialização:', error);
        const container = document.getElementById('container-filmes');
        if (container) {
            container.innerHTML = '<p class="text-danger">Erro ao carregar o conteúdo. Recarregue a página.</p>';
        }
    }
});

// Função para carregar filmes
async function carregarFilmes() {
    try {
        const response = await fetch('http://localhost:3000/filmes');
        if (!response.ok) throw new Error('Falha ao carregar filmes');
        const data = await response.json();
        return data.filmes || data;
    } catch (error) {
        console.error("Erro ao carregar filmes:", error);
        return [];
    }
}

// Renderizar os filmes na home-page
function renderizarFilmes(filmes) {
    const container = document.getElementById('container-filmes');
    if (!container) return;

    if (!filmes || filmes.length === 0) {
        container.innerHTML = '<div class="col-12"><p class="text-center">Nenhum filme disponível</p></div>';
        return;
    }

    container.innerHTML = filmes.map(filme => `
        <div class="col-md-4 mb-4">
            <div class="card h-100">
                <img src="${filme.imagem || 'placeholder.jpg'}" 
                     class="card-img-top" 
                     alt="${filme.titulo}"
                     style="height: 300px; object-fit: cover;"
                     onerror="this.src='placeholder.jpg'">
                <div class="card-body">
                    <h5 class="card-title">${filme.titulo}</h5>
                    <p class="card-text text-muted">${filme.generos || 'Gênero não informado'}</p>
                    <div class="d-flex justify-content-between">
                        <a href="detalhes.html?id=${filme.id}" class="btn btn-sm btn-primary">
                            Detalhes
                        </a>
                        <button class="btn btn-sm ${isFavorito(filme.id) ? 'btn-warning' : 'btn-outline-warning'} btn-favoritar" 
                                data-id="${filme.id}"
                                onclick="toggleFavorito(${filme.id}, this)">
                            ${isFavorito(filme.id) ? '⭐ Favoritado' : '⭐ Favoritar'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

// Renderizar carrossel
function renderizarCarrossel(filmes) {
    const carouselIndicators = document.getElementById('carousel-indicators');
    const carouselInner = document.getElementById('carousel-inner');
    
    if (!carouselIndicators || !carouselInner) return;
    carouselIndicators.innerHTML = '';
    carouselInner.innerHTML = '';

    filmes.slice(0, 3).forEach((filme, index) => {
        if (!filme.imagem) return;

        const indicator = document.createElement('button');
        indicator.type = 'button';
        indicator.dataset.bsTarget = '#carouselExampleCaptions';
        indicator.dataset.bsSlideTo = index;
        if (index === 0) indicator.classList.add('active');
        indicator.setAttribute('aria-label', `Slide ${index + 1}`);
        carouselIndicators.appendChild(indicator);
        
        const slide = document.createElement('div');
        slide.className = `carousel-item ${index === 0 ? 'active' : ''}`;
        slide.innerHTML = `
            <img src="${filme.imagem}" class="d-block w-100" 
                 alt="${filme.titulo}"
                 style="height: 500px; object-fit: cover;"
                 onerror="this.style.display='none'">
            <div class="carousel-caption d-none d-md-block bg-dark bg-opacity-75 rounded">
                <h5>${filme.titulo}</h5>
                <p>${filme.generos || ''}</p>
            </div>
        `;
        carouselInner.appendChild(slide);
    });
}

// Favoritar filmes
// Verifica se um filme é favorito
function isFavorito(id) {
    const favoritos = JSON.parse(localStorage.getItem('filmesFavoritos')) || [];
    return favoritos.includes(id);
}

// Atualiza o contador na navbar
function atualizarContadorFavoritos() {
    const contador = document.getElementById('contador-favoritos');
    if (contador) {
        const favoritos = JSON.parse(localStorage.getItem('filmesFavoritos')) || [];
        contador.textContent = favoritos.length;
    }
}

// Função principal para favoritar/desfavoritar
function toggleFavorito(id, botao) {
    let favoritos = JSON.parse(localStorage.getItem('filmesFavoritos')) || [];
    
    if (isFavorito(id)) {
        favoritos = favoritos.filter(filmeId => filmeId !== id);
        botao.innerHTML = '⭐ Favoritar';
        botao.classList.replace('btn-warning', 'btn-outline-warning');
    } else {
        favoritos.push(id);
        botao.innerHTML = '⭐ Favoritado';
        botao.classList.replace('btn-outline-warning', 'btn-warning');
    }
    
    localStorage.setItem('filmesFavoritos', JSON.stringify(favoritos));
    atualizarContadorFavoritos(); 
    console.log('Favoritos atualizados:', favoritos);


    if (window.location.pathname.endsWith('index.html')) {
        setTimeout(() => {
            window.location.href = "favoritos.html"; 
        }, 1000);
    }
}

// Carrega os filmes favoritos
function carregarFavoritos() {
    if (!window.location.pathname.endsWith('favoritos.html')) return;

    const container = document.getElementById('container-filmes');
    const semFavoritosMsg = document.getElementById('sem-favoritos');

    fetch('http://localhost:3000/filmes')
        .then(response => response.json())
        .then(todosFilmes => {
            const favoritosIds = JSON.parse(localStorage.getItem('filmesFavoritos')) || [];
            const filmesFavoritos = todosFilmes.filter(filme => favoritosIds.includes(filme.id));
            
            if (filmesFavoritos.length > 0) {
                renderizarFilmes(filmesFavoritos);
                if (semFavoritosMsg) semFavoritosMsg.style.display = 'none';
            } else {
                if (semFavoritosMsg) semFavoritosMsg.style.display = 'block';
                if (container) container.innerHTML = '';
            }
        })
        .catch(error => {
            console.error("Erro:", error);
            if (semFavoritosMsg) {
                semFavoritosMsg.innerHTML = 'Erro ao carregar favoritos.';
                semFavoritosMsg.style.display = 'block';
            }
        });
}


document.addEventListener('DOMContentLoaded', () => {
    atualizarContadorFavoritos(); 
    carregarFavoritos();
});


// Pesquisar filmes
function pesquisarEmTempoReal() {
    const termo = document.getElementById('campoBusca').value.trim().toLowerCase();
    filtrarFilmes(termo);
}

function filtrarFilmes(termo) {
    const cards = document.querySelectorAll('#container-filmes .col-md-4');
    const carrossel = document.getElementById('carouselExampleCaptions');
    
    if (!termo) {
        cards.forEach(card => card.style.display = 'block');
        if (carrossel) carrossel.style.display = 'block';
        return;
    }
    if (carrossel) carrossel.style.display = 'none';

    cards.forEach(card => {
        const titulo = card.querySelector('.card-title').textContent.toLowerCase();
        const generos = card.querySelector('.card-text').textContent.toLowerCase();
        const corresponde = titulo.includes(termo) || generos.includes(termo);
        card.style.display = corresponde ? 'block' : 'none';
    });
}