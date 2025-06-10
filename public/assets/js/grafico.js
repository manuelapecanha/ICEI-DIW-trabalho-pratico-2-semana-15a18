document.addEventListener("DOMContentLoaded", async () => {
    try {
        console.log("Iniciando carregamento do gráfico...");
        
        const ctx = document.getElementById('graficoPizza');
        if (!ctx) throw new Error("Canvas não encontrado!");
        
        // 1. Carrega os filmes
        const response = await fetch('http://localhost:3000/filmes');
        if (!response.ok) throw new Error("Erro ao carregar filmes");
        const filmes = await response.json();
        
        console.log("Dados recebidos da API:", filmes); // DEBUG IMPORTANTE

        // 2. Processa os gêneros
        const contagemGeneros = {};
        
        filmes.forEach(filme => {
            // Verifica se generos existe e é um array
            if (!Array.isArray(filme.generos)) {
                console.warn("Filme sem array de gêneros:", filme.id);
                return;
            }
            
            filme.generos.forEach(genero => {
                const generoNormalizado = genero.trim().toLowerCase();
                if (generoNormalizado) {
                    contagemGeneros[generoNormalizado] = (contagemGeneros[generoNormalizado] || 0) + 1;
                }
            });
        });

        console.log("Contagem final:", contagemGeneros); // DEBUG CRÍTICO

        // 3. Cria o gráfico
        new Chart(ctx.getContext('2d'), {
            type: 'pie',
            data: {
                labels: Object.keys(contagemGeneros),
                datasets: [{
                    data: Object.values(contagemGeneros),
                    backgroundColor: [
                        '#FF6384', '#36A2EB', '#FFCE56', 
                        '#4BC0C0', '#9966FF', '#FF9F40',
                        '#8AC24A', '#607D8B'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'right',
                    },
                    tooltip: {
                        callbacks: {
                            label: (context) => {
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                const percentage = Math.round((context.raw / total) * 100);
                                return `${context.label}: ${context.raw} (${percentage}%)`;
                            }
                        }
                    }
                }
            }
        });

    } catch (error) {
        console.error("Erro crítico:", error);
        alert("Erro ao carregar gráfico. Verifique o console (F12)");
    }
});