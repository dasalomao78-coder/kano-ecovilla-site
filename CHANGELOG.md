# Changelog (Kano Ecovilla)

Todas as alterações notáveis neste projeto serão documentadas neste arquivo, servindo como histórico de atualizações e diário de bordo do desenvolvimento.

## [2026-06-02]
### Adicionado
- Nova imagem gerada por IA (ultrarrealista) para a **Universidade da Natureza**.
- Implementação inicial deste `CHANGELOG.md` e atualização estrutural do `RULES.md`.

### Alterado
- **Prevenção de Scroll Automático Indesejado:** Adicionada a trava de segurança `e.isTrusted` na seção de Tecnologia (`main.js`). Isso resolve o bug em que o `AutoPlayManager` acionava a função `scrollIntoView()` a cada 5 segundos no mobile, "puxando" (rolando) a tela do usuário forçadamente para cima e interrompendo a leitura das seções inferiores.
- **Layout Mobile (Economia Circular):** Substituição do layout circular em escala reduzida por um layout de empilhamento vertical clássico flexível, melhorando consideravelmente a legibilidade e garantindo o mesmo padrão de impacto visual do desktop.
- **Traduções e Textos:** Alteração de "Escola da Natureza" para "Universidade da Natureza", e refinamento da descrição para focar em cursos imersivos de permacultura, agrofloresta e bioconstrução (`translations.js` e `index.html`).
- **Imagens da Escola:** Substituição da ilustração robótica em "Escola Kano" pela fotografia antiga e realista da estufa com as crianças e mestres.

### Deploy
- Enviadas as alterações de interface para produção no GitHub, com deploy automático finalizado no Vercel.
