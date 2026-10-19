# 5.6 - Resolução de Conflitos de configuração

> Seção 5 - Persistência de Dados com Node.js · Lição 6 de 16

Até agora, conseguimos subir nossos containers e a aplicação sem problemas. No entanto, conforme trabalhamos com múltiplos projetos, é comum surgirem conflitos, principalmente quando uma porta específica no sistema operacional já está em uso.

Neste vídeo, vamos explorar técnicas e dicas práticas para te ajudar a lidar com esses conflitos e os atalhos que facilitam a solução desse tipo de problema.

> **Vídeo da aula:** [assistir online](https://player.vimeo.com/video/1039088425)

## Comandos utilizados no vídeo

Para encerrar todos os processos Node que estão sendo executados na sua máquina:

```bash
killall node
```

Para parar todos os containers Docker em execução:

```bash
docker stop $(docker ps -qa)
```
