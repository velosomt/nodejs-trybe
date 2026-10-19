# 6.10 - Adicionando Nova Regra de Negócio

> Seção 6 - Design Modular com Arquitetura em Camadas · Lição 10 de 19

## Implementando a Regra de Negócio: Aprovação ou Reprovação Automática

1.  **Descrição da Regra de Negócio:** O objetivo desta regra é definir automaticamente o status de aprovação ou reprovação de um estudante em uma disciplina com base em sua nota final. Isso automatiza o processo de avaliação e permite que o sistema atualize o status sem a necessidade de intervenção manual.
    
2.  **Estrutura do Código**: Vamos utilizar três arquivos principais:
    
3.  `enrollmentModel.js` na Model, para manipulação de notas e status no banco de dados;
    
4.  `studentService.js` na Service, para centralizar a lógica de aprovação e reprovação;
5.  `studentController.js` na Controller, para responder às requisições HTTP de atualização de status.

### Arquivo: `src/model/enrollmentModel.js`

No Model, agora vamos focar em duas operações na tabela `enrollments`:

-   Consulta da nota (`grade`) de uma matrícula;
-   Atualização do status da matrícula com base na nota final.

```javascript
// src/model/enrollmentModel.js

// Outras Implementações

const getGradeByEnrollment = async (studentId, subjectId) => {
  const [[result]] = await conn.execute(`
    SELECT grade, status FROM enrollments
         WHERE student_id = ? AND subject_id = ?`, [studentId, subjectId]);

  return result;
};

const updateEnrollmentStatus = async (studentId, subjectId, status) => {
  const [result] = await conn.execute(`
    UPDATE enrollments SET status = ? WHERE student_id = ? AND subject_id = ?`,
  [status, studentId, subjectId]);

  return result;
};

module.exports = {
  // getEnrollmentCountBySubject,
  // addEnrollment,
  getGradeByEnrollment,
  updateEnrollmentStatus,
}
```

-   `getGradeByEnrollment`: Recupera a nota (`grade`) e o status da matrícula para um estudante e uma disciplina específicos.
-   `updateEnrollmentStatus`: Atualiza o `status` da matrícula com base na regra de negócio (aprovado/reprovado).

### Arquivo: `src/service/studentService.js`

Na Service, implementamos a lógica da regra de negócio de aprovação/reprovação com base na `grade` armazenada na tabela `enrollments`.

```javascript
// src/service/studentService.js

// Outras Implementações

const updateEnrollmentGradeStatus = async (studentId, subjectId) => {
  const enrollmentData = await enrollmentModel.getGradeByEnrollment(studentId, subjectId);

  if (!enrollmentData) {
    return { status: 'error', message: 'Enrollment Not Found!' };
  }

  const { grade } = enrollmentData;
  const status = grade >= 60 ? 'completed' : 'cancelled';

  await enrollmentModel.updateEnrollmentStatus(studentId, subjectId, status);

  return {
    status: 'success',
    message: `Student ${status === 'completed' ? 'Approved' : 'Failed'}`
  };
};

// module.exports = {
//   enrollStudentInSubject,
  updateEnrollmentGradeStatus,
// }
```

#### Lógica da Regra de Negócio:

-   **Checagem de Existência**: Se a matrícula não for encontrada, retorna uma mensagem de erro.
-   **Definição de Status**: Se a `grade` é igual ou superior a 60, a matrícula é marcada como `completed` (aprovado); caso contrário, é `cancelled` (reprovado).
-   **Atualização de Status**: Atualiza o `status` da matrícula diretamente na tabela `enrollments`.

### Arquivo: `src/controller/stundentController.js`

Por fim, no Controller, lidamos com a requisição para atualizar o status da matrícula:

```javascript
// src/controller/stundentController.js

// Outras Implementações

const updateGradeStatus = async (req, res) => {
  const { studentId, subjectId } = req.params;

  try {
    const result = await studentService.updateEnrollmentGradeStatus(studentId, subjectId);

    if (result.status === 'error') return res.status(404).json({ message: result.message });

    return res.status(200).json({ message: result.message });
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
//   enrollStudent,
  updateGradeStatus,
// }
```

-   `updateGradeStatus`: Recebe os parâmetros `studentId` e `subjectId`, chama o Service para verificar a `grade` e atualizar o `status`, e responde com o status da operação.

### Arquivo: `src/controller/studentsRoutes.js`

```javascript
// src/controller/studentsRoutes.js

// Outras Implementações

router.put('/:studentId/subjects/:subjectId', studentController.updateGradeStatus);

// module.exports = router;
```

Para recapitular sobre o conteúdo, assista ao vídeo a seguir:

> **Vídeo da aula:** [assistir online](https://player.vimeo.com/video/1040225015)
