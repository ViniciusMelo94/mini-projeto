const express = require('express')
const app = express()
const port = 3015

//Lista temporária
let produtos = []

app.use(express.json())

const logsInf = (req, res, next) => {
    const infor = new Date().toISOString() // informa data hora e ação
    console.log(`A chamada foi reailziada em ${infor} para ${req.method}`)
    next()
}
app.use(logsInf)

//Rota POST para adicionar um novo produto
app.post("/produtos", (req, res) => {
    const novoProduto = req.body;

    //Validação dos dados recebidos
    if (!novoProduto.nome || !novoProduto.preco || !novoProduto.descricao) {
        return res.status(400).send("Dados incompletos. Por favor, forneça todos os dados.")
    }

    //Adicionar o novo produto à lista
    produtos.push(novoProduto)

    // Mensagem de sucesso e o produto adicionado
    res.status(201).json({mensagem: "Produto adicionado com sucesso.", produtos: novoProduto})
})
//Rota GET para obter todos os produtos
app.get("/produtos", (req, res) => {
    //Retorna a lista de produtos em formato JSON
    res.json(produtos)
})
//Rota PUT para atualizar um produto existente
app.put("/produtos/:id", (req, res) => {
    const {id} = req.params
    const atualizaProduto = req.body
    //Encontra o produto na lista pelo ID
    const index = produtos.findIndex(produto => produto.id === parseInt(id))
    //Verifica se o produto existe
    if (index === -1) {
        return res.status(404).send("Produto não encontrado.")
    }
    //Atualiza os dados do produto
    produtos[index] = {...produtos[index], ...atualizaProduto}
    //Responde com uma mensagem de sucesso e o produto atualizado
    res.status(200).send({mensagem: "Produto atualizado com sucesso.", produto: produtos[index]})
})
//Rota delete para excluir um produto
app.delete("/produtos/:id", (req, res) => {
    const {id} = req.params
    //Encontra o produto na lista pelo ID
    const index = produtos.findIndex(produto => produto.id === parseInt(id)) 
    //Verifica se o produto existe
    if (index === -1){
        return res.status(404).send("Produto não encontrado.")
    }
    //Remove o produto
    const produtoRemovido = produtos.splice(index, 1) [0]
    res.status(200).json({"Produto removido com sucesso!": produtoRemovido})
})

//Inicia servidor
app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`)
});