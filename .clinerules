# Diretrizes de Desenvolvimento e Segurança da IA (Site Ecovilla)

> [!IMPORTANT]
> Estas regras são estritamente obrigatórias e devem ser consultadas e obedecidas por qualquer agente de Inteligência Artificial antes de propor ou realizar qualquer modificação no código ou infraestrutura do projeto **Site Ecovilla**.

---

## 1. Diretrizes de Layout e UI (Aparência Premium)
* **Fundo do Hero Claro:** A primeira tela (Hero) que exibe a ecovila do alto deve manter a imagem `Imagem da ecovilla de cima.jpg` bem visível e nítida. O overlay de contraste no topo deve ser sempre sutil (`rgba(27, 67, 50, 0.12)`) para evitar que a imagem de alta definição fique fosca, escura ou sem nitidez.
* **Indicador de Rolagem:** O texto "ROLAR PARA EXPLORAR" e o ícone da folha de seta devem ser mantidos com destaque de escala ampliada em 100% (`font-size: 1.6rem`, `.scroll-arrow` com `64px`), garantindo alta visibilidade e visual de luxo.
* **Roda de Economia Circular:**
  * Os cards de economia circular devem usar fotos ultrarealistas no contêiner com `object-fit: cover` (preenchendo a totalidade do espaço de imagem).
  * **Interatividade ativa:** Ao clicar ou selecionar um card, a IA deve aplicar a classe `.active` para ampliá-lo em **15%** (`scale(1.15)`) com realce de brilho e sombras correspondentes a cada subsistema, garantindo uma interação premium e viva.

## 2. Padrão de Deploy e Controle de Código
* **Deploy Automático/Manual:** Sempre que você realizar qualquer alteração, correção ou upgrade de funcionalidade/layout neste projeto, você deve:
  1. Adicionar e commitar as modificações localmente no Git.
  2. Garantir o deploy imediato das alterações em ambiente de produção no **Vercel** (seja rodando o comando `vercel --prod` via Vercel CLI de forma manual ou integrando com o push no GitHub).
