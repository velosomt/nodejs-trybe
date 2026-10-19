// Seção extra escrita pela IA: o mínimo de CI/CD (não faz parte do curso original da Trybe).
// Cada lição: slug, título, arquivo HTML desta pasta e, opcionalmente, um quiz.

const quiz = [
  {
    q: 'Qual a diferença entre <strong>Continuous Delivery</strong> e <strong>Continuous Deployment</strong>?',
    opts: [
      'Nenhuma, são sinônimos.',
      'Na Delivery o código aprovado na CI fica pronto para produção, mas o deploy depende de uma aprovação/ação manual. No Deployment ele vai para produção automaticamente.',
      'Delivery só existe com Docker. Deployment só existe com Railway.',
      'Delivery roda os testes e Deployment não roda testes.',
    ],
    correct: 1,
    why: 'As duas partem de uma CI confiável. A diferença é só o último passo: com aprovação humana (Delivery) ou automático (Deployment).',
  },
  {
    q: 'Por que usar <code>npm ci</code> em vez de <code>npm install</code> no pipeline?',
    opts: [
      'Porque <code>npm ci</code> instala as versões mais novas de todos os pacotes.',
      'Porque <code>npm ci</code> não precisa de internet.',
      'Porque <code>npm ci</code> instala exatamente o que está no <code>package-lock.json</code>, parte de um <code>node_modules</code> limpo e falha se o lock estiver desatualizado.',
      'Porque <code>npm install</code> não funciona no Linux.',
    ],
    correct: 2,
    why: 'Instalação reprodutível: o pipeline testa exatamente as mesmas versões que você testou localmente e que irão para produção.',
  },
  {
    q: 'Como o pipeline sabe que os testes falharam?',
    opts: [
      'Lendo o texto "FAIL" no log.',
      'Pelo código de saída do comando: qualquer valor diferente de <code>0</code> faz o step (e o job) falhar.',
      'Pelo número de arquivos de teste.',
      'O GitHub analisa a cobertura de código e decide.',
    ],
    correct: 1,
    why: 'Por isso nunca se deve "engolir" o erro com <code>|| true</code>: o pipeline ficaria verde com testes quebrados.',
  },
  {
    q: 'Onde deve ficar o token de deploy do Railway (ou a senha do usuário técnico do BTP)?',
    opts: [
      'No arquivo <code>.env</code> commitado no repositório.',
      'Direto no YAML do workflow, já que o repositório é privado.',
      'Em uma <strong>Variable</strong> do GitHub, acessada com <code>vars</code>.',
      'Em um <strong>Secret</strong> do GitHub (de preferência no environment de destino), acessado com <code>${{ secrets.NOME }}</code> e passado ao comando via <code>env</code>.',
    ],
    correct: 3,
    why: 'Secrets são criptografados, não podem ser lidos depois de salvos e aparecem mascarados no log. Variables são para configuração não sensível.',
  },
  {
    q: 'No workflow abaixo, o que garante que o deploy só acontece se os testes passarem?',
    code: 'jobs:\n  test: ...\n  deploy:\n    needs: test\n    if: github.ref == \'refs/heads/main\'',
    opts: [
      'O <code>needs: test</code>: o job <code>deploy</code> só começa depois que o job <code>test</code> termina com sucesso.',
      'O <code>if</code>, que verifica se os testes passaram.',
      'A ordem em que os jobs aparecem no arquivo.',
      'Nada: jobs sempre rodam em paralelo.',
    ],
    correct: 0,
    why: 'Sem <code>needs</code>, os jobs rodam em paralelo. O <code>if</code> só restringe o deploy à branch <code>main</code>.',
  },
  {
    q: 'Na API Cookmaster com autodeploy no Railway, qual a forma mais simples de impedir o deploy quando a CI falha?',
    opts: [
      'Apagar o Dockerfile.',
      'Ativar a opção <strong>Wait for CI</strong> no serviço do Railway, com um workflow disparado por <code>push</code> na <code>main</code>.',
      'Rodar os testes dentro do <code>CMD</code> do Dockerfile.',
      'Fazer deploy só às sextas-feiras.',
    ],
    correct: 1,
    why: 'Com Wait for CI, o Railway deixa o deploy em WAITING e o pula se algum workflow do GitHub Actions falhar.',
  },
  {
    q: 'Em um projeto <strong>SAP CAP</strong> para Cloud Foundry, qual sequência representa build e deploy no pipeline?',
    opts: [
      '<code>docker build</code> → <code>docker push</code> → <code>railway up</code>',
      '<code>cds watch</code> → <code>git push</code>',
      '<code>mbt build</code> (lê o <code>mta.yaml</code> e roda o <code>cds build --production</code>) → <code>cf deploy arquivo.mtar</code>',
      '<code>npm start</code> → <code>cf push</code> com usuário e senha no <code>mta.yaml</code>',
    ],
    correct: 2,
    why: 'O <code>mta.yaml</code> (criado com <code>cds add mta</code>) descreve módulos e serviços. O <code>cf deploy</code> cria os serviços, faz o deploy do schema no HANA e sobe os apps. O <code>cds add gha</code> gera um workflow que faz exatamente isso.',
  },
];

const letters = 'ABCDE';

module.exports = {
  title: '[OBS da IA] - CI/CD: o mínimo para deploy automatizado',
  lessons: [
    { slug: 'ia-cicd-1-introducao', title: 'IA.1 - O que é CI/CD e onde o curso se encaixa', file: '01-introducao.html' },
    { slug: 'ia-cicd-2-preparando-o-projeto', title: 'IA.2 - Preparando o projeto para a CI', file: '02-preparando-o-projeto.html' },
    { slug: 'ia-cicd-3-github-actions', title: 'IA.3 - GitHub Actions: o primeiro pipeline de CI', file: '03-github-actions.html' },
    { slug: 'ia-cicd-4-segredos-e-protecao', title: 'IA.4 - Segredos, ambientes e proteção da branch main', file: '04-segredos-e-protecao.html' },
    { slug: 'ia-cicd-5-deploy-continuo', title: 'IA.5 - Deploy contínuo da API Cookmaster', file: '05-deploy-continuo.html' },
    { slug: 'ia-cicd-6-sap-cap', title: 'IA.6 - CI/CD para SAP CAP no BTP', file: '06-cicd-sap-cap.html' },
    {
      slug: 'ia-cicd-7-para-nao-esquecer-mais',
      title: 'IA.7 - Para não esquecer mais + exercício + quiz',
      file: '07-para-nao-esquecer-mais.html',
      quiz: {
        title: 'Quiz - CI/CD',
        known: true,
        questions: quiz.map((x) => ({
          prompt: `<p>${x.q}</p>${x.code ? `<pre><code class="language-yaml">${x.code}</code></pre>` : ''}`,
          options: x.opts.map((o, i) => ({ letter: letters[i], html: `<p>${o}</p>`, correct: i === x.correct })),
          explanation: `<p>${x.why}</p>`,
        })),
      },
    },
  ],
};
