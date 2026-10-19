# Próximos passos

> [Conteúdo Complementar] - Banco de Dados · Lição 1 de 1

Nas próximas seções, iremos abordar conteúdos que exigem conhecimento prévio em **[banco de dados relacional](https://cursos.betrybe.com/191920)**. Se você já tem familiaridade com esse tema, pode seguir diretamente para as próximas lições. Caso contrário, recomendamos que faça nosso curso complementar de banco de dados.

Se você avançar e perceber que está tendo dificuldades por falta de conhecimento em banco de dados, sugerimos que volte e complete o curso complementar antes de continuar.

Para ajudar na decisão, preparamos um quiz com perguntas sobre os tópicos necessários. Se você acertar as questões, pode prosseguir com confiança. Caso contrário, será fundamental fazer o curso complementar para garantir o melhor aproveitamento do conteúdo.

## Quiz

### Questão 1

Considerando uma tabela Funcionarios com as colunas ID, Nome, Salario e ID\_Departamento, e uma tabela Departamentos com as colunas ID\_Departamento e Nome\_Departamento, qual das seguintes consultas retorna todos os funcionários junto com o nome de seu departamento, incluindo os funcionários que não estão associados a nenhum departamento?

- **A)** SELECT \* FROM Funcionarios LEFT JOIN Departamentos ON Funcionarios.ID = Departamentos.ID\_Departamento
- **B)** SELECT \* FROM Funcionarios RIGHT JOIN Departamentos ON Funcionarios.ID = Departamentos.ID\_Departamento
- **C)** SELECT \* FROM Funcionarios INNER JOIN Departamentos ON Funcionarios.ID\_Departamento = Departamentos.ID\_Departamento
- **D)** SELECT \* FROM Funcionarios LEFT JOIN Departamentos ON Funcionarios.ID\_Departamento = Departamentos.ID\_Departamento
- **E)** SELECT \* FROM Funcionarios FULL JOIN Departamentos ON Funcionarios.ID\_Departamento = Departamentos.ID\_Departamento

### Questão 2

Você tem duas tabelas, Clientes e Pedidos, onde Pedidos.ClienteID é uma chave estrangeira que referencia Clientes.ClienteID. Qual seria o resultado de uma consulta SQL que usa INNER JOIN entre essas tabelas, mas não possui nenhum registro correspondente em Pedidos para um cliente específico?

- **A)** O cliente aparecerá com valores nulos para os campos de Pedidos.
- **B)** O cliente será exibido sem nenhuma informação dos pedidos.
- **C)** Todos os pedidos serão exibidos, mesmo sem cliente correspondente.
- **D)** A consulta falhará devido à falta de correspondência.
- **E)** O cliente não será exibido na consulta.

### Questão 3

Qual consulta SQL corretamente retorna os três maiores salários de uma tabela Funcionarios, ordenados em ordem decrescente, excluindo empates de salário?

- **A)** SELECT DISTINCT Salario FROM Funcionarios ORDER BY Salario DESC LIMIT 3
- **B)** SELECT Salario FROM Funcionarios ORDER BY Salario DESC LIMIT 3
- **C)** SELECT TOP 3 Salario FROM Funcionarios WHERE DISTINCT ORDER BY Salario DESC
- **D)** SELECT TOP 3 Salario FROM Funcionarios WHERE DISTINCT ORDER BY Salario ASC
- **E)** SELECT Salario FROM Funcionarios GROUP BY Salario LIMIT 3

### Questão 4

Qual das alternativas descreve corretamente o uso da cláusula LIKE em uma consulta SQL?

- **A)** A cláusula LIKE é usada para realizar comparações exatas de texto em colunas de uma tabela.
- **B)** A cláusula LIKE é usada para verificar se um valor está dentro de um intervalo de valores numéricos.
- **C)** A cláusula LIKE só pode ser usada em conjunto com a função COUNT.
- **D)** A cláusula LIKE permite filtrar resultados que correspondem a um padrão específico, utilizando curingas como % e \_
- **E)** A cláusula LIKE é usada exclusivamente para comparar valores nulos em uma tabela.

### Questão 5

Você deseja selecionar registros de uma tabela Produtos onde o preço está entre R$ 100 e R$ 500. Qual das opções a seguir representa uma possível cláusula WHERE correta?

- **A)** WHERE Preco BETWEEN 100 AND 500
- **B)** WHERE Preco LIKE 100 AND 500
- **C)** WHERE Preco >= 100 AND <= 500
- **D)** WHERE Preco IN (100, 500)
- **E)** WHERE Preco IN RANGE (100, 500)

### Questão 6

Você está trabalhando com uma tabela Funcionarios e deseja selecionar todos os funcionários cujo departamento seja 'Vendas', 'Marketing' ou 'RH'. Qual das consultas a seguir representa uma possível cláusula WHERE correta?

- **A)** WHERE Departamento BETWEEN 'Vendas' AND 'RH'
- **B)** WHERE Departamento LIKE 'Vendas, Marketing, RH'
- **C)** WHERE Departamento = 'Vendas' OR 'Marketing' OR 'RH'
- **D)** WHERE Departamento EXISTS ('Vendas', 'Marketing', 'RH')
- **E)** WHERE Departamento IN ('Vendas', 'Marketing', 'RH')

### Questão 7

Qual comando SQL você utilizaria para remover colunas de uma tabela existente?

- **A)** DELETE COLUMN
- **B)** ALTER TABLE ... DROP COLUMN
- **C)** REMOVE COLUMN
- **D)** UPDATE TABLE ... REMOVE COLUMN
- **E)** DROP TABLE

### Questão 8

Qual das seguintes consultas retorna todos os registros onde a terceira letra do nome do cliente é a letra 'b' e termina com qualquer sequência de caracteres?

- **A)** WHERE Nome IN ('b%')
- **B)** WHERE Nome LIKE '%b'
- **C)** WHERE Nome LIKE '\_\_\_b%'
- **D)** WHERE Nome LIKE '\_\_\_b'
- **E)** WHERE Nome IN ('%b%')

### Questão 9

Qual das alternativas a seguir define corretamente o conceito de uma chave primária em um banco de dados relacional?

- **A)** É um campo que pode ter valores duplicados e serve para identificar registros unicamente.
- **B)** É um campo ou conjunto de campos que identifica de forma única cada registro em uma tabela e não pode conter valores nulos ou duplicados.
- **C)** É um campo usado para estabelecer relações entre diferentes tabelas, sem restrição de valores duplicados.
- **D)** É um campo que armazena dados em formato binário e sempre possui um índice associado.
- **E)** É um campo obrigatório em todas as tabelas e pode ser compartilhado por várias colunas.

### Questão 10

Qual das seguintes afirmações é verdadeira sobre chaves estrangeiras em bancos de dados relacionais?

- **A)** Uma chave estrangeira é sempre composta por múltiplas colunas.
- **B)** Chaves estrangeiras podem conter valores nulos e não precisam fazer referência a uma chave primária de outra tabela.
- **C)** A chave estrangeira é usada para criar relacionamentos entre tabelas, referenciando uma chave primária em outra tabela.
- **D)** Uma chave estrangeira deve ser única em sua tabela, assim como uma chave primária.
- **E)** Chaves estrangeiras são usadas apenas para garantir que valores de colunas sejam exclusivos.

<details><summary>Gabarito</summary>

**1.** D

**2.** E

**3.** A

**4.** D

**5.** A

**6.** E

**7.** B

**8.** C

**9.** B

**10.** C

</details>
