# Atualizar o portfólio

Os registros ficam em `src/content/records/`. A home, o Laboratório e o LINEA leem os mesmos arquivos. Para adicionar um registro, copie um arquivo existente, ajuste os campos e dê a ele um `slug` único, em minúsculas e com hífens.

## Escrever e publicar um registro

1. Salve o arquivo como `seu-slug.draft.json` com `"publication": "draft"`. Apenas arquivos com sufixo `.published.json` entram no pacote do site.
2. Escreva `title`, `summary` e os parágrafos em `body`. Use `type` para o formato editorial, como “Registro de processo” ou “Experimento visual”. Use `projectStage` para o estado do trabalho, como “Em desenvolvimento”. O campo `publication` controla a exibição do registro.
3. Em `date`, use a data real no formato `AAAA-MM-DD` ou `null` quando ela estiver sem confirmação. Preencha `tags` e `relatedProjects` com listas. Os identificadores de projetos disponíveis estão em `src/content/archive.js`.
4. Quando o texto estiver pronto, renomeie para `seu-slug.published.json` e mude `publication` para `published`. A mudança entra na próxima compilação do site. Use `featured: true` para concorrer a uma das três entradas mais recentes da home. Com `"relatedProjects": ["linea"]`, o mesmo registro também aparece em `/linea`.

O Laboratório ordena os registros do mais recente para o mais antigo e deixa os sem data ao final. Cada um pode ser compartilhado por `/laboratorio#seu-slug`. Para adicionar links, use uma lista `links` com objetos no formato `{ "label": "Título do link", "href": "https://…" }`.

## Adicionar uma imagem

Salve uma cópia otimizada em `public/images/laboratorio/`. Inclua um objeto `cover` no registro com `src` apontando para `/images/laboratorio/nome.webp`, `alt` descrevendo o conteúdo e `width` e `height` com as dimensões reais em pixels. `caption` é opcional. Guarde o original no acervo. Mantenha imagens privadas fora de `public/` até que estejam prontas para aparecer no site.

A apresentação do projeto fica em `src/content/linea.json`. Quando houver interfaces reais aprovadas, adicione-as à lista `interfaces` com os mesmos campos de uma imagem de registro. Para documentar a evolução, crie um registro relacionado a `linea`.

## Trocar a imagem de um projeto por um vídeo na abertura

Coloque o MP4 em `public/images/` ou numa subpasta de projeto. Em `src/content/project-films.json`, associe o nome do projeto ao caminho do vídeo a partir de `/images/`, como no exemplo do Apê E-L. Os nomes disponíveis são **Apê E-L**, **Solaris**, **Sense**, **Isola** e **Home Office I-G**. A imagem existente funciona como capa até a reprodução.

Para seguir o enquadramento da primeira versão, exporte em **9:16**, por exemplo **720 × 1280**, em **MP4 com H.264**. A abertura reproduz sem som e passa ao próximo projeto quando o vídeo acaba.

Para conferir o resultado localmente, use `npm run dev` e abra a URL exibida pelo Vite.
