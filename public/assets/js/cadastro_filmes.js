const apiUrl = 'http://localhost:3000/filmes';

function displayMessage(mensagem) {
    const msg = document.getElementById('msg');
    msg.innerHTML = `<div class="alert alert-warning">${mensagem}</div>`;
}

function readFilmes(processaDados) {
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => processaDados(data))
        .catch(error => {
            console.error('Erro ao ler filmes via API JSONServer:', error);
            displayMessage("Erro ao ler filmes");
        });
}

function createFilme(filme, refreshFunction) {
    fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(filme),
    })
        .then(response => response.json())
        .then(() => {
            displayMessage("Filme inserido com sucesso");
            if (refreshFunction) refreshFunction();
        })
        .catch(error => {
            console.error('Erro ao inserir filme via API JSONServer:', error);
            displayMessage("Erro ao inserir filme");
        });
}

function updateFilme(id, filme, refreshFunction) {
    fetch(`${apiUrl}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(filme),
    })
        .then(response => response.json())
        .then(() => {
            displayMessage("Filme alterado com sucesso");
            if (refreshFunction) refreshFunction();
        })
        .catch(error => {
            console.error('Erro ao atualizar filme via API JSONServer:', error);
            displayMessage("Erro ao atualizar filme");
        });
}

function deleteFilme(id, refreshFunction) {
    fetch(`${apiUrl}/${id}`, { method: 'DELETE' })
        .then(response => {
            if (response.ok) {
                displayMessage("Filme removido com sucesso");
                if (refreshFunction) refreshFunction();
            } else {
                displayMessage("Erro ao remover filme");
            }
        })
        .catch(error => {
            console.error('Erro ao remover filme via API JSONServer:', error);
            displayMessage("Erro ao remover filme");
        });
}

function exibeFilmes() {
    const tableFilmes = document.getElementById("table-filmes");
    tableFilmes.innerHTML = "";

    readFilmes(dados => {
        for (let i = 0; i < dados.length; i++) {
            const filme = dados[i];
            tableFilmes.innerHTML += `
                <tr>
                    <td>${filme.id}</td>
                    <td>${filme.titulo}</td>
                    <td>${filme.diretor}</td>
                    <td>${filme.lancamento}</td>
                    <td>${filme.generos}</td>
                    <td>${filme.sinopse}</td>
                    <td><img src="${filme.imagem}" alt="${filme.titulo}" width="80" /></td>
                </tr>`;
        }
    });
}

function init() {
    const formFilme = document.getElementById("form-filme");

    document.getElementById("btnInsert").addEventListener("click", () => {
        if (!formFilme.checkValidity()) {
            displayMessage("Preencha o formulário corretamente.");
            return;
        }

        const filme = {
            titulo: document.getElementById("inputTitulo").value,
            diretor: document.getElementById("inputDiretor").value,
            lancamento: document.getElementById("inputLancamento").value,
            generos: document.getElementById("inputGeneros").value,
            sinopse: document.getElementById("inputSinopse").value,
            imagem: document.getElementById("inputImagem").value
        };

        createFilme(filme, exibeFilmes);
        formFilme.reset();
        document.getElementById("inputTitulo").focus();
    });

    document.getElementById("btnUpdate").addEventListener("click", () => {
        const campoId = document.getElementById("inputId").value;
        if (!campoId) {
            displayMessage("Selecione um filme para alterar.");
            return;
        }

        const filme = {
            titulo: document.getElementById("inputTitulo").value,
            diretor: document.getElementById("inputDiretor").value,
            lancamento: document.getElementById("inputLancamento").value,
            generos: document.getElementById("inputGeneros").value,
            sinopse: document.getElementById("inputSinopse").value,
            imagem: document.getElementById("inputImagem").value
        };

        updateFilme(parseInt(campoId), filme, exibeFilmes);
        formFilme.reset();
        document.getElementById("inputTitulo").focus();
    });

    document.getElementById("btnDelete").addEventListener("click", () => {
        const campoId = document.getElementById("inputId").value;
        if (!campoId) {
            displayMessage("Selecione um filme para excluir.");
            return;
        }

        deleteFilme(parseInt(campoId), exibeFilmes);
        formFilme.reset();
        document.getElementById("inputTitulo").focus();
    });

    document.getElementById("btnClear").addEventListener("click", () => {
        formFilme.reset();
        document.getElementById("inputTitulo").focus();
    });

    document.getElementById("msg").addEventListener("DOMSubtreeModified", (e) => {
        if (e.target.innerHTML == "") return;
        setTimeout(() => {
            const alert = document.querySelector("#msg .alert");
            if (alert) alert.remove();
        }, 5000);
    });

    document.getElementById("grid-filmes").addEventListener("click", (e) => {
        if (e.target.tagName === "TD") {
            const linha = e.target.parentNode;
            const colunas = linha.querySelectorAll("td");

            document.getElementById("inputId").value = colunas[0].innerText;
            document.getElementById("inputTitulo").value = colunas[1].innerText;
            document.getElementById("inputDiretor").value = colunas[2].innerText;
            document.getElementById("inputLancamento").value = colunas[3].innerText;
            document.getElementById("inputGeneros").value = colunas[4].innerText;
            document.getElementById("inputSinopse").value = colunas[5].innerText;
            document.getElementById("inputImagem").value = colunas[6].querySelector('img')?.src || "";
        }
    });

    exibeFilmes();
}