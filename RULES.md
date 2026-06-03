# Diretrizes de Desenvolvimento e Segurança da IA (Kano Ecovilla)

> [!IMPORTANT]
> Estas regras são estritamente obrigatórias e devem ser consultadas e obedecidas por qualquer agente de Inteligência Artificial antes de propor ou realizar qualquer modificação no código ou infraestrutura do projeto **Site Ecovilla**.

---

## 1. Segurança e Chaves de API
* **Exposição de Credenciais:** Nunca insira chaves de API, tokens de acesso ou credenciais diretamente no código (`hardcoded`). Utilize sempre variáveis de ambiente e garanta que arquivos confidenciais estejam devidamente listados no `.gitignore`.
* **APIs Pagas:** Se qualquer funcionalidade planejada exigir o uso ou integração com uma **API paga**, você deve alertar explicitamente o usuário antes de prosseguir com qualquer implementação ou teste.

## 2. Qualidade do Código e Reutilização
* **DRY (Don't Repeat Yourself):** Reaproveite o máximo de código possível. Evite redundâncias, duplicações ou lógicas repetidas. Crie estilos reaproveitáveis no CSS e mantenha o JavaScript bem estruturado e modular.
* **Internacionalização:** Todos os novos textos devem ser mapeados no arquivo `translations.js` e chamados via atributo `data-i18n` no HTML, respeitando o suporte nativo a múltiplos idiomas.

## 3. Diretrizes de Layout e UI (Aparência Premium)
* **Fundo do Hero Claro:** A primeira tela (Hero) que exibe a ecovila do alto deve manter a imagem original bem visível e nítida. O overlay de contraste no topo deve ser sempre sutil (`rgba(27, 67, 50, 0.12)`) para evitar que a imagem de alta definição fique fosca, escura ou sem nitidez.
* **Estética Premium:** O design deve refletir a estética Solarpunk. Utilize cores harmônicas (tons de verde, dourado solar), backgrounds translúcidos (glassmorphism) e evite elementos básicos de UI, priorizando sempre um visual sofisticado.

## 4. Controle de Ambientes e Confirmação de Produção
* **Homologação Padrão:** Por padrão, todas as alterações, deploys ou modificações de design/código devem ser aplicadas e testadas primeiro no ambiente de desenvolvimento local do usuário.
* **Deploy/Migração para Produção:** 
  * A alteração **só poderá ser enviada para a branch principal (Produção) via `git push`** após autorização expressa do usuário.
  * Antes de realizar qualquer ação em Produção (como um `git push` que ative o Vercel), a IA **obrigatoriamente deve solicitar a palavra-chave de confirmação** para o usuário para evitar atualizações acidentais no site público.
  * A palavra-chave de confirmação necessária é:
    > **`@Viraremprodução`**
  * *Observação: Se o usuário esquecer a palavra-chave, a IA pode relembrá-lo, pois o objetivo deste código é puramente evitar ações acidentais em produção.*

## 5. Histórico de Alterações (Changelog)
* **Registro de Atualizações:** Sempre que realizar qualquer atualização, modificação ou correção no projeto (seja visual ou lógica), a IA deve obrigatoriamente criar ou atualizar um arquivo na raiz do projeto chamado `CHANGELOG.md`. Esse arquivo deve conter a data, a hora e o resumo detalhado das alterações que foram efetivamente executadas (documentando de forma similar a um diário de bordo tudo o que já foi concluído no desenvolvimento).
