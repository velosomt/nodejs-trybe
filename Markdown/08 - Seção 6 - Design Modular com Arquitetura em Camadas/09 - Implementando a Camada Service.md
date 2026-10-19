# 6.9 - Implementando a Camada Service

> Seção 6 - Design Modular com Arquitetura em Camadas · Lição 9 de 19

Agora que já discutimos a camada Service e o conceito de regra de negócio, é o momento de aplicar esses conceitos no nosso código. Cada regra de negócio será implementada de forma prática e isolada, garantindo que cada camada — Model, Service e Controller — desempenhe seu papel específico, facilitando futuras manutenções ou ajustes.

## Implementando a Regra de Negócio: Limite de estudantes por Disciplina

1.  **Descrição da Regra de Negócio**: O objetivo é garantir que o número de estudantes matriculados em uma disciplina não ultrapasse a capacidade máxima definida para ela. A camada Service ficará responsável pela lógica de verificação do limite, enquanto o Model fará o acesso ao banco de dados para consultas e a Controller organizará o fluxo de requisição e resposta.
    
2.  **Estrutura do Código**: Vamos criar/utilizar três arquivos principais:
    
3.  `enrollmentModel.js` na Model, para manipulação do banco de dados;
    
4.  `studentService.js` na Service, para centralizar a lógica da regra de negócio;
5.  `studentController.js` na Controller, para responder às requisições HTTP de matrícula.

### Arquivo: `src/model/enrollmentModel.js`

Na Model, criaremos funções para:

-   Consultar a quantidade de matrículas ativas em uma disciplina específica;
-   Inserir uma nova matrícula.

```javascript
// src/model/enrollmentModel.js

const conn = require('./connection');

const getEnrollmentCountBySubject = async (subjectId) => {
  const [[result]] = await conn.execute(`
    SELECT COUNT(enr.subject_id) AS enrollmentCount,
    su.max_students AS maxStudents
    FROM enrollments AS enr
    JOIN subjects AS su
    ON su.id = enr.subject_id
    WHERE enr.subject_id = ? AND enr.status = "active"
    GROUP BY enr.subject_id`, [subjectId]);

  return result;
};

const addEnrollment = async (studentId, subjectId) => {
  const [result] = await conn.execute(
    'INSERT INTO enrollments (student_id, subject_id) VALUES (?, ?);',
    [studentId, subjectId],
  );

  return result;
};

module.exports = {
  getEnrollmentCountBySubject,
  addEnrollment,
};
```

-   `getEnrollmentCountBySubject`: Consulta o número atual de matrículas ativas em uma disciplina, retornando a quantidade de pessoas matrículadas e quantidade de pessoas que a disciplica pode ter.
-   `addEnrollment`: Insere uma nova matrícula para o estudante e disciplina especificados.

### Arquivo: `src/service/studentService.js`

```javascript
// src/service/studentService.js

const enrollmentModel = require('../model/enrollmentModel');

const enrollStudentInSubject = async (studentId, subjectId) => {
  const enrollmentData = await enrollmentModel.getEnrollmentCountBySubject(subjectId);

  if (!enrollmentData) {
    return { status: 'error', message: 'Subject Not Found!' };
  }

  const { enrollmentCount, maxStudents } = enrollmentData;

  if (enrollmentCount >= maxStudents) {
    return { status: 'error', message: 'Classroom is Full' };
  }

  await enrollmentModel.addEnrollment(studentId, subjectId);

  return { status: 'success', message: 'Enrollment Successful' };
};

module.exports = {
  enrollStudentInSubject,
};
```

#### Lógica da Regra de Negócio:

-   **Checagem de Existência**: Caso o `subjectId` fornecido não exista, retorna uma mensagem de erro.
-   **Limite de Matrículas**: Se o número de matrículas ativas atinge o limite, retorna uma mensagem indicando que a turma está cheia.
-   **Processo de Matrícula**: Se houver vagas, a matrícula é criada e uma confirmação é retornada.

### Arquivo: `src/controller/stundentController.js`

```javascript
// src/controller/stundentController.js

// const studentModel = require('../model/studentModel');
const studentService = require('../service/studentService');

const INTERNAL_SERVER_ERROR = 'Internal Server Error!';

// Outras Implementações

const enrollStudent = async (req, res) => {
  const { studentId, subjectId } = req.params;

  try {
    const result = await studentService.enrollStudentInSubject(studentId, subjectId);

    if (result.status === 'error') return res.status(400).json({ message: result.message });

    return res.status(201).json({ message: result.message });
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({ message: INTERNAL_SERVER_ERROR });
  }
};

// module.exports = {
//   getAllStudents,
//   getByIdStudent,
//   createStudent,
//   updatedStudent,
//   removeStudent,
  enrollStudent,
// };
```

-   `INTERNAL_SERVER_ERROR`: Esta contante é utilizada para evitar a duplicação de código nas funções do controller. Faça as modificações igual no exemplo para evitar muitas duplicações referentes a string `'Internal Server Error!'`;
    
-   `enrollStudent`: Esta função recebe `studentId` e `subjectId` da requisição, passa os dados para a Service e trata a resposta de forma apropriada, retornando status HTTP 400 ou 404 em caso de erro e 201 em caso de sucesso.
    

### Arquivo: `src/controller/studentsRoutes.js`

```javascript
// src/controller/studentsRoutes.js

// Outras Implementações

router.post('/:studentId/subjects/:subjectId', studentController.enrollStudent);

// module.exports = router;
```

<details>
<summary>OBS da IA</summary>

**Para o SAP CAP**

-   Contagem no CAP sem trazer as linhas: ``const { count } = await SELECT.one`count(*) as count`.from(Enrollments).where({ subject_ID: id })``. Evite consultar dentro de loop: agrupe com `IN` + `Map` quando precisar de vários.

</details>

## Considerações

Esses arquivos e funções implementam de forma modular a regra de negócio de limite de estudantes por disciplina, respeitando a separação de responsabilidades. Cada camada assume uma função específica:

-   **Model**: Responsável por consultar e modificar o banco de dados.
-   **Service**: Centraliza a lógica de negócio, verificando condições e gerando respostas específicas.
-   **Controller**: Lida com a entrada e saída da API, facilitando a interação com o cliente.

Dessa forma, caso seja necessário modificar alguma condição da regra (por exemplo, alterar o limite de estudantes), as mudanças ocorrerão apenas na camada Service, sem impacto direto na Controller ou Model.

Para recapitular sobre o conteúdo, assista ao vídeo a seguir:

> **Vídeo da aula:** [assistir online](https://player.vimeo.com/video/1040225533)
