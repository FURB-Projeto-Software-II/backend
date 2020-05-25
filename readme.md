# Drop&Take - Backend

### Pré requisitos

NPM ou YARN

Algum editor de código ( VSCode recomendado )

Postman ou Insomnia

Git

### Instalação

Baixar o repositório do git:

```bash
git clone https://github.com/FURB-Projeto-Software-II/backend
```

Entrar na pasta do projeto:

```bash
cd backend
```

Instale as dependencias

```bash
npm install
```

ou 

```bash
yarn install
```

Configurar o arquivo .env

Fazer uma cópia do arquivo .env-exemple com o nome .env e realizar a configurações das variáveis de ambiente necessárias.

### Execução

Dentro da pasta do projeto execute:

```bash
npm start 
```

ou

```bash
yarn start
```

### Git

Após o clone, trocar da branch master para a sua branch de desenvolvimento:

```bash
git checkout -b nome_dev
```

Para realizar os commits:

```bash
git add .
git commit -m "Descricao do commit"
git push origin nome_dev
```

### Deploy

Para realizar o deploy em produção é preciso subir o código para a branch master do github.

Após realizar o commit na sua branch de desenvolvimento, solicitar um pull request da sua branch para a master.