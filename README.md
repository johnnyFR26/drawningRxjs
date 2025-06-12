# drawningRxjs 🚀

Recriação didática de alguns operadores do **RxJS** utilizando JavaScript puro para aprendizado.

---

## 🔍 Visão Geral

Este projeto tem como objetivo:

* Reproduzir o funcionamento de operadores populares do RxJS (*map*, *filter*, *merge*, *combineLatest*, etc.) em JavaScript puro.
* Ajudar desenvolvedores a entender a lógica interna e os conceitos por trás da programação reativa.
* Servir como base de estudo ou referência para quem quer se aprofundar em RxJS e programação funcional.

---

## ✅ Funcionalidades implementadas

* `map` – transforma cada valor emitido.
* `filter` – filtra valores com base em uma condição.
* `merge` – combina múltiplos observables.
* `combineLatest` – emite quando qualquer observable emite, com os valores mais recentes de cada um.

---

## 🗂 Estrutura do Projeto

```
/
├── Dockerfile              # Para builds em container (opcional)
├── README.Docker.md        # Instruções específicas para Docker
├── compose.yaml            # Configuração Docker Compose (se aplicável)
├── index.html              # Exemplo de uso via navegador
├── index.js                # Setup do ambiente de testes/exemplos
├── operators.js            # Implementações dos operadores
├── package.json
└── package-lock.json
```

---

## ⚙️ Como usar

### 1. Instalação

```bash
git clone https://github.com/johnnyFR26/drawningRxjs.git
cd drawningRxjs
npm install
```

### 2. Exemplos no navegador

Execute um servidor local (ex: `http-server`, `live-server`) e abra `index.html`.

### 3. Executando via Node.js

```bash
npm start
```

Você verá no console exemplos de uso dos operadores implementados.

---

## 🧪 Exemplos Rápidos

```js
const { map, filter } = require('./operators');

const source = [1, 2, 3, 4];

const mapped = map(source, x => x * 2);
console.log(mapped); // [2, 4, 6, 8]

const filtered = filter(source, x => x % 2 === 0);
console.log(filtered); // [2, 4]
```

---

## 🧹 Como contribuir

Contribuições são bem-vindas! Veja como pode ajudar:

1. Faça um *fork* do projeto.
2. Crie uma *branch* (`git checkout -b feat/novo-operador`).
3. Adicione testes e documentação.
4. Envie um *pull request* com descrição clara do que adicionou/trocou.

---

## 📄 Licença

Este projeto está licenciado sob a [MIT License](LICENSE).


---

## 📚 Recursos

* [RxJS Documentation](https://rxjs.dev)
* Blogs e tutoriais sobre programação reativa

---
