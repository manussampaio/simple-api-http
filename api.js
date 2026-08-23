import http from "node:http"

const PORT = 3000;

const tarefas = [
		{id: 1, titulo: "Estudar HTTP do NodeJS"},
		{id: 2, titulo: "Lavar louças"}
];

const server = http.createServer((req, res) => {
	// Toda resposta será em JSON
	res.setHeader('Content-Type', 'application/json');

	
	if (req.method == "GET" && req.url == "/tarefas") {
		res.statusCode = 200;
		res.end(JSON.stringify(tarefas));

	} else if (req.method === "GET" && req.url.startsWith("/tarefas/busca")) {
		const url = new URL(req.url, 'http://localhost');
		const titulo = url.searchParams.get("titulo") || "";

		const tarefasFiltradas = tarefas
			.filter(tarefa => tarefa.titulo.toLowerCase().includes(titulo.toLowerCase())
		);

		res.statusCode = 200;
		res.end(JSON.stringify(tarefasFiltradas));

	} else if (req.method === "DELETE" && req.url.startsWith("/tarefas")) {
    	const url = new URL(req.url, 'http://localhost');
    	const index = url.searchParams.get("index");

    	tarefas.splice(index, 1);

    	res.statusCode = 200;
    	res.end(JSON.stringify({ mensagem: 'Removido!' }));
		
	} else if (req.method == "POST" && req.url == "/tarefas") {
		let body = ''
		
		// Escuta a chegada dos pedaços de dados da requisição
		req.on('data', chunk => {
			body += chunk.toString();
		});
		
		req.on('end', () => {
			try{
				const novaTarefa = JSON.parse(body);
				
				if (!novaTarefa.titulo) {
					res.statusCode = 400
					res.end(JSON.stringify({error: "O campo 'titulo' é obrigatório!"}));
				}
				
				const tarefaCriada = {
					id: tarefas.length + 1,
					titulo: novaTarefa.titulo
				}
				
				tarefas.push(JSON.stringify(tarefaCriada))
				
				
				res.statusCode = 201
				
				res.end(JSON.stringify(tarefaCriada));
			} catch(error){
				res.statusCode = 400;
				res.end(JSON.stringify({error: "Formato JSON inválido!"}));
				
			}
		});
	} else {
		res.statusCode = 404
		res.end(JSON.stringify({error: "Página não encontrada!"}))
	}
});

server.listen(PORT, () => {
	console.log(`Servidor rodando na porta: ${PORT}`);
});