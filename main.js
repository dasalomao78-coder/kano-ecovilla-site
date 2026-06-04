import { translations } from './translations.js';

document.addEventListener("DOMContentLoaded", () => {
  // --- INICIALIZAÇÃO DE IDIOMA DE PREFERÊNCIA ---
  let currentLang = "pt"; // Padrão PT
  
  // --- SPLASH SCREEN / PRELOADER LOGIC ---
  const preloader = document.getElementById('preloader');
  const preloaderNature = document.getElementById('preloader-nature');
  const heroSliderCont = document.querySelector('.hero-slider-container');
  const heroTitle = document.querySelector('.hero-floating-title');
  
  if (preloader) {
    // Desabilita interações do usuário durante a animação inicial
    document.body.style.pointerEvents = 'none';
    
    // 1. Injetar as folhas caindo (Fase 1)
    if (preloaderNature) {
       const heroLeaf = document.getElementById('hero-balancing-leaf');
       const leafSrc = heroLeaf ? heroLeaf.src : './folha.png';
       for (let i = 0; i < 20; i++) {
          const leaf = document.createElement('img');
          leaf.src = leafSrc;
          leaf.className = 'intro-leaf';
          leaf.style.left = `${Math.random() * 100}vw`;
          const size = Math.random() * 20 + 95; // ~105px (tamanho gigante)
          leaf.style.width = `${size}px`;
          leaf.style.animationDuration = `${Math.random() * 1.5 + 1.5}s`;
          leaf.style.animationDelay = `${Math.random() * 0.5}s`;
          leaf.style.transform = `rotate(${Math.random() * 360}deg)`;
          preloaderNature.appendChild(leaf);
       }
    }

    // 2. Remover todo o preloader e revelar carrossel
    setTimeout(() => {
      preloader.classList.add('fade-out');
      
      setTimeout(() => {
        document.body.classList.remove('loading');
        document.body.style.pointerEvents = 'auto'; // Reativa interações
        if (heroSliderCont) heroSliderCont.classList.add('show');
        if (heroTitle) heroTitle.classList.add('show');
        const heroLeaf = document.getElementById('hero-balancing-leaf');
        if (heroLeaf) heroLeaf.classList.add('show');
      }, 500); 
      
      setTimeout(() => {
        preloader.remove();
      }, 1000);
      
    }, 3200);
  } else {
    // Caso não exista preloader por algum motivo
    document.body.classList.remove('loading');
    document.body.style.pointerEvents = 'auto';
    if (heroSliderCont) heroSliderCont.classList.add('show');
    if (heroTitle) heroTitle.classList.add('show');
    const heroLeaf = document.getElementById('hero-balancing-leaf');
    if (heroLeaf) heroLeaf.classList.add('show');
  }
  
  // --- GERADOR DE PARTÍCULAS DE LUZ SOLAR ---
  const spawnParticles = () => {
    const container = document.getElementById("particles-container");
    if (!container) return;
    
    const particleCount = 25;
    for (let i = 0; i < particleCount; i++) {
      createParticle(container);
    }
  };

  const createParticle = (container) => {
    const particle = document.createElement("div");
    particle.className = "particle";
    
    // Propriedades aleatórias para suavidade orgânica
    const size = Math.random() * 8 + 4;
    const startX = Math.random() * 100;
    const delay = Math.random() * 8;
    const duration = Math.random() * 6 + 6;
    
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    particle.style.left = `${startX}vw`;
    particle.style.animationDelay = `${delay}s`;
    particle.style.animationDuration = `${duration}s`;
    
    container.appendChild(particle);
    
    // Remove e recria ao final da animação para manter o loop infinito
    particle.addEventListener("animationend", () => {
      particle.remove();
      createParticle(container);
    });
  };
  
  spawnParticles();



  // --- NAV BAR TRANSIÇÃO AO ROLAR ---
  const header = document.getElementById("main-header");
  
  // Esconde o header inicialmente na seção Hero (se não houver rolagem)
  if(window.scrollY < window.innerHeight * 0.3) {
    header.classList.add("hidden-on-hero");
  }
  
  window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }

    // Exibe o cabeçalho global apenas quando o usuário passar do Hero
    if (window.scrollY < window.innerHeight * 0.3) {
      header.classList.add("hidden-on-hero");
    } else {
      header.classList.remove("hidden-on-hero");
    }
  });

  // --- REVEAL ANIMATIONS (INTERSECTION OBSERVER) ---
  const revealElements = document.querySelectorAll(".reveal");
  
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("active");
        observer.unobserve(entry.target); // Roda a animação apenas uma vez
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: "0px 0px -50px 0px"
  });
  
  revealElements.forEach((el) => {
    revealObserver.observe(el);
  });

  // --- SISTEMA DE TRADUÇÃO (PT / EN) ---
  const langToggle = document.getElementById("lang-toggle");
  const heroLangToggle = document.getElementById("hero-lang-toggle");
  
  const updateLangTexts = (lang) => {
    const textToSet = lang === "pt" ? "EN" : "PT";
    if (langToggle) {
       const text = langToggle.querySelector(".lang-text");
       if (text) text.textContent = textToSet;
    }
    if (heroLangToggle) {
       const text = heroLangToggle.querySelector(".lang-text");
       if (text) text.textContent = textToSet;
    }
  };
  
  const translatePage = (lang) => {
    currentLang = lang;
    
    // Atualiza o atributo lang do HTML
    document.documentElement.lang = lang;
    
    // Atualiza os textos dos botões
    updateLangTexts(lang);
    
    // Busca todos os elementos com data-i18n
    const translateElements = document.querySelectorAll("[data-i18n]");
    translateElements.forEach((el) => {
      const key = el.getAttribute("data-i18n");
      const translation = getNestedTranslation(translations[lang], key);
      
      if (translation) {
        // Se contiver tags HTML simples (ex: listas, quebras), injeta innerHTML, caso contrário textContent
        if (translation.includes("<li>") || translation.includes("<br>") || translation.includes("<strong>")) {
          el.innerHTML = translation;
        } else {
          el.textContent = translation;
        }
      }
    });
    
    // Atualiza também os placeholders e títulos se houver
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute("content", lang === "pt" ? 
        "Kano Ecovilla: O Ecossistema Solarpunk. Um sistema operacional vivo para a habitação humana no Brasil, integrando permacultura, bioconstrução e inteligência artificial." :
        "Kano Ecovilla: The Solarpunk Ecosystem. A living operating system for human habitation in Brazil, integrating permaculture, bioconstruction, and AI."
      );
    }
  };
  
  // Função auxiliar para acessar chaves aninhadas (ex: "hero.title")
  const getNestedTranslation = (obj, path) => {
    return path.split('.').reduce((acc, part) => acc && acc[part], obj);
  };
  
  const toggleLang = () => {
    const newLang = currentLang === "pt" ? "en" : "pt";
    translatePage(newLang);
  };

  if (langToggle) {
    langToggle.addEventListener("click", toggleLang);
  }
  if (heroLangToggle) {
    heroLangToggle.addEventListener("click", toggleLang);
  }

  // --- SEÇÃO 2: INTERATIVIDADE DO INFINITO (∞) ---
  const infinityNodes = document.querySelectorAll(".infinity-node");
  const infinityPanes = document.querySelectorAll(".infinity-pane");
  
  infinityNodes.forEach((node) => {
    const handleNodeActivation = () => {
      const nodeId = node.id; // node-left, node-right, node-center
      const targetPaneId = `infinity-pane-${nodeId.split('-')[1]}`;
      
      // Atualiza estado ativo do nó
      infinityNodes.forEach(n => n.classList.remove("active"));
      node.classList.add("active");
      
      // Exibe painel correspondente com fade
      infinityPanes.forEach(pane => {
        pane.classList.remove("active");
        if (pane.id === targetPaneId) {
          pane.classList.add("active");
        }
      });
    };

    node.addEventListener("mouseenter", handleNodeActivation);
    node.addEventListener("click", handleNodeActivation);
  });

  // --- SEÇÃO 4: INTERATIVIDADE DO MASTERPLAN RADIAL ---
  const radialRings = document.querySelectorAll(".radial-ring, .radial-satellite");
  const mpTitle = document.getElementById("mp-title");
  const mpDesc = document.getElementById("mp-desc");
  
  radialRings.forEach((ring) => {
    const handleRingActivation = () => {
      const zoneId = ring.getAttribute("data-zone");
      
      // Adiciona classe active na visualização
      radialRings.forEach(r => r.classList.remove("active"));
      ring.classList.add("active");
      
      // Busca a tradução correspondente da zona
      const titleKey = `masterplan.zones.${zoneId}.title`;
      const descKey = `masterplan.zones.${zoneId}.desc`;
      
      if (mpTitle && mpDesc) {
        mpTitle.textContent = getNestedTranslation(translations[currentLang], titleKey);
        mpDesc.textContent = getNestedTranslation(translations[currentLang], descKey);
        
        // Adiciona um data-i18n dinâmico para garantir que mude de idioma depois
        mpTitle.setAttribute("data-i18n", titleKey);
        mpDesc.setAttribute("data-i18n", descKey);
      }
    };
    
    ring.addEventListener("mouseenter", handleRingActivation);
    ring.addEventListener("click", handleRingActivation);
  });

  // --- SEÇÃO 6: INTERATIVIDADE DA PILHA TECNOLÓGICA ---
  const isoLayers = document.querySelectorAll(".tech-svg-layer");
  const techBlocks = document.querySelectorAll(".tech-info-block");
  
  isoLayers.forEach((layer) => {
    const handleLayerActivation = (e) => {
      const targetIdx = layer.getAttribute("data-target");
      
      // Destaca a camada isométrica
      isoLayers.forEach(l => l.classList.remove("active"));
      layer.classList.add("active");
      
      // Destaca o bloco de informações correspondente
      techBlocks.forEach(block => {
        block.classList.remove("active");
        if (block.getAttribute("data-index") === targetIdx) {
          block.classList.add("active");
          // Rola suavemente até o bloco se em mobile (Apenas se for interação do usuário)
          if (window.innerWidth <= 1024 && e && e.isTrusted) {
            block.scrollIntoView({ behavior: "smooth", block: "nearest" });
          }
        }
      });
    };
    
    layer.addEventListener("mouseenter", handleLayerActivation);
    layer.addEventListener("click", handleLayerActivation);
  });

  // Permite o inverso: interagir com o bloco destaca a camada
  techBlocks.forEach((block) => {
    block.addEventListener("mouseenter", () => {
      const idx = block.getAttribute("data-index");
      techBlocks.forEach(b => b.classList.remove("active"));
      block.classList.add("active");
      
      isoLayers.forEach(l => {
        l.classList.remove("active");
        if (l.getAttribute("data-target") === idx) {
          l.classList.add("active");
        }
      });
    });
  });

  // --- SEÇÃO 7: INTERATIVIDADE DA GOVERNANÇA HÍBRIDA ---
  const pipelineSteps = document.querySelectorAll(".pipeline-step");
  const progressLine = document.querySelector(".pipeline-progress");
  
  pipelineSteps.forEach((step) => {
    const handleStepActivation = () => {
      const stepNum = parseInt(step.getAttribute("data-step"));
      
      // Ativa todas as etapas anteriores e a atual
      pipelineSteps.forEach(s => {
        const sNum = parseInt(s.getAttribute("data-step"));
        if (sNum <= stepNum) {
          s.classList.add("active");
        } else {
          s.classList.remove("active");
        }
      });
      
      // Atualiza largura da linha de progresso
      if (progressLine) {
        // 1=0%, 2=33%, 3=66%, 4=100%
        const percent = ((stepNum - 1) / 3) * 100;
        progressLine.style.width = `${percent}%`;
      }
    };

    step.addEventListener("mouseenter", handleStepActivation);
    step.addEventListener("click", handleStepActivation);
  });

  // Automação da animação do pipeline baseada no scroll
  const governanceSection = document.getElementById("governance");
  let pipelineAnimated = false;
  
  if (governanceSection) {
    window.addEventListener("scroll", () => {
      if (pipelineAnimated) return;
      
      const rect = governanceSection.getBoundingClientRect();
      const isVisible = (rect.top <= window.innerHeight * 0.6) && (rect.bottom >= 0);
      
      if (isVisible) {
        pipelineAnimated = true;
        // Faz uma simulação de fluxo sequencial animado
        let delay = 300;
        pipelineSteps.forEach((step, idx) => {
          setTimeout(() => {
            step.dispatchEvent(new Event("mouseenter"));
          }, delay);
          delay += 1000;
        });
      }
    });
  }

  // --- ANIMAÇÃO PARALLAX DA FOLHA ---
  const leaf = document.getElementById("parallax-leaf");
  if (leaf) {
    let lastScroll = window.scrollY;
    let targetAccumulated = 0;
    let currentAccumulated = 0;
    const cycleLength = window.innerHeight * 1.5; // O ciclo de queda dura 1.5x a altura da janela
    
    // Configura o scroll inicial para bater com o valor real
    window.addEventListener("scroll", () => {
      const currentScroll = window.scrollY;
      const delta = currentScroll - lastScroll;
      lastScroll = currentScroll;
      
      // Acumula apenas o deslocamento absoluto no alvo
      targetAccumulated += Math.abs(delta);
    });
    
    // Loop de animação contínuo LERP para fluidez de luxo
    const animateLeaf = () => {
      // Linear Interpolation: 8% de aproximação por frame para amortecimento fluido
      currentAccumulated += (targetAccumulated - currentAccumulated) * 0.08;
      
      // Progresso de 0 a 1 no ciclo
      const progress = (currentAccumulated % cycleLength) / cycleLength;
      
      // Move a folha para baixo (Y) e atravessa do centro para a direita (X)
      // Inicia a -150px (acima da tela) e termina em window.innerHeight + 150px (abaixo da tela)
      const translateY = progress * (window.innerHeight + 300) - 150;
      
      // Atravessa a tela da esquerda (-10% da largura) para a direita (60% da largura)
      const translateX = (progress * window.innerWidth * 0.7) - (window.innerWidth * 0.1);
      
      // Rotaciona a folha constantemente com o avanço
      const rotate = progress * 720;
      
      leaf.style.transform = `translate(${translateX}px, ${translateY}px) rotate(${rotate}deg)`;
      
      requestAnimationFrame(animateLeaf);
    };
    
    // Inicia o loop
    animateLeaf();
  }

  // --- SEÇÃO 10: INTERATIVIDADE DO PAINEL DO TIME ---
  const teamAvatars = document.querySelectorAll(".team-avatar");
  const panelContent = document.querySelector(".team-panel-content");
  const panelName = document.querySelector(".team-panel-name");
  const panelRole = document.querySelector(".team-panel-role");
  const panelBio = document.querySelector(".team-panel-bio");

  if (teamAvatars.length > 0 && panelContent) {
    teamAvatars.forEach((avatar) => {
      const handleAvatarActivation = () => {
        if (avatar.classList.contains("active")) return;

        // Ativa o avatar
        teamAvatars.forEach(a => a.classList.remove("active"));
        avatar.classList.add("active");

        const idx = avatar.getAttribute("data-member");
        const name = avatar.getAttribute("data-name");

        // Transição de fade out
        panelContent.classList.add("fade-out");

        setTimeout(() => {
          // Atualiza conteúdo
          if (panelName) panelName.textContent = name;
          
          if (panelRole) {
            const roleKey = `team.member${idx}Role`;
            panelRole.setAttribute("data-i18n", roleKey);
            panelRole.textContent = getNestedTranslation(translations[currentLang], roleKey);
          }

          if (panelBio) {
            const bioKey = `team.member${idx}Bio`;
            panelBio.setAttribute("data-i18n", bioKey);
            panelBio.textContent = getNestedTranslation(translations[currentLang], bioKey);
          }

          // Transição de fade in
          panelContent.classList.remove("fade-out");
        }, 250);
      };

      avatar.addEventListener("mouseenter", handleAvatarActivation);
      avatar.addEventListener("click", handleAvatarActivation);
    });
  }

  // --- CARROSSEL 3D DE VIVÊNCIAS ---
  const cards = document.querySelectorAll(".carousel-card");
  const prevBtn = document.querySelector(".prev-btn");
  const nextBtn = document.querySelector(".next-btn");
  
  if (cards.length > 0) {
    let currentIndex = 0;
    
    const updateCarousel = (newIndex) => {
      // Remove all classes
      cards.forEach(card => {
        card.classList.remove("active", "prev", "next");
      });
      
      const total = cards.length;
      const prevIndex = (newIndex - 1 + total) % total;
      const nextIndex = (newIndex + 1) % total;
      
      cards[newIndex].classList.add("active");
      cards[prevIndex].classList.add("prev");
      cards[nextIndex].classList.add("next");
    };
    
    // Set initial state
    updateCarousel(currentIndex);
    
    if (prevBtn && nextBtn) {
      prevBtn.addEventListener("click", () => {
        currentIndex = (currentIndex - 1 + cards.length) % cards.length;
        updateCarousel(currentIndex);
      });
      
      nextBtn.addEventListener("click", () => {
        currentIndex = (currentIndex + 1) % cards.length;
        updateCarousel(currentIndex);
      });
    }
    
    // Allow clicking on prev/next cards to navigate
    cards.forEach((card, index) => {
      card.addEventListener("click", () => {
        if (!card.classList.contains("active")) {
          currentIndex = index;
          updateCarousel(currentIndex);
        }
      });
    });
  }

  // --- SEÇÃO 3: CÓDIGO DE ÉTICA (ACCORDION PASTAS NATIVO) ---
  const ethicsCards = document.querySelectorAll(".ethics-card");
  
  if (ethicsCards.length > 0) {
    ethicsCards.forEach((card, idx) => {
      // Inicia o Card 0 como ativo no mobile por padrão
      if (idx === 0 && !document.querySelector(".ethics-card.active")) {
        card.classList.add("active");
      }
      
      card.addEventListener("click", () => {
        if (window.innerWidth <= 768) {
          ethicsCards.forEach(c => c.classList.remove("active"));
          card.classList.add("active");
        }
      });
    });
  }

  // --- CARROSSÉIS COM PONTOS (GOVERNANÇA E ESCOLA) ---
  function initDotCarousel(containerSelector, dotsSelector, itemSelector) {
    const container = document.querySelector(containerSelector);
    const dotsContainer = document.querySelector(dotsSelector);
    if (!container || !dotsContainer) return;

    const dots = dotsContainer.querySelectorAll(".dot");
    const items = container.querySelectorAll(itemSelector);
    if (dots.length === 0 || items.length === 0) return;

    // Atualiza os pontos baseados no scroll
    container.addEventListener("scroll", () => {
      const scrollPos = container.scrollLeft;
      // Usar a largura de scroll total / numero de itens para ser mais preciso
      const itemWidth = container.scrollWidth / items.length;
      let index = Math.round(scrollPos / itemWidth);
      if (index >= dots.length) index = dots.length - 1;
      if (index < 0) index = 0;
      
      dots.forEach(d => d.classList.remove("active"));
      dots[index].classList.add("active");
    });

    // Permite clicar nos pontos
    dots.forEach((dot, index) => {
      dot.addEventListener("click", () => {
        const itemWidth = container.scrollWidth / items.length;
        container.scrollTo({ left: index * itemWidth, behavior: 'smooth' });
      });
    });
  }

  // Inicializa para ambos
  initDotCarousel(".pipeline-steps", ".carousel-dots-gov", ".pipeline-step");
  initDotCarousel(".mobile-carousel", ".carousel-dots-school", ".mobile-carousel-card");

  // --- SEÇÃO 8: ECONOMIA CIRCULAR (ACCORDION + NAV CIRCULAR MOBILE) ---
  const economyCards = document.querySelectorAll(".economy-node-card");
  const mobileNavNodes = document.querySelectorAll(".mobile-nav-node");
  
  if (economyCards.length > 0) {
    // Inicializa o primeiro card como ativo no mobile
    if (window.innerWidth <= 768) {
      if (!document.querySelector(".economy-node-card.active")) {
        economyCards[0].classList.add("active");
        if(mobileNavNodes[0]) mobileNavNodes[0].classList.add("active");
      }
    }

    // Clique na Navegação Circular (Mobile)
    mobileNavNodes.forEach((node, idx) => {
      node.addEventListener("click", () => {
        if (window.innerWidth <= 768) {
          economyCards.forEach(c => c.classList.remove("active"));
          mobileNavNodes.forEach(n => n.classList.remove("active"));
          
          node.classList.add("active");
          if(economyCards[idx]) {
            economyCards[idx].classList.add("active");
          }
        }
      });
    });
    
    // Clique no próprio Cartão
    economyCards.forEach((card, idx) => {
      card.addEventListener("click", () => {
        if (window.innerWidth <= 768) {
          // Comportamento Accordion no Mobile
          const isActive = card.classList.contains("active");
          economyCards.forEach(c => c.classList.remove("active"));
          mobileNavNodes.forEach(n => n.classList.remove("active"));
          
          if (!isActive) {
            card.classList.add("active");
            if(mobileNavNodes[idx]) mobileNavNodes[idx].classList.add("active");
          }
        } else {
        // Desktop/Tablet: Alterna estado ativo para ampliação do card selecionado
          const isActive = card.classList.contains("active");
          economyCards.forEach(c => c.classList.remove("active"));
          if (!isActive) {
            card.classList.add("active");
          }
        }
      });
    });
  }

  // --- HERO 3D Z-AXIS CAROUSEL (ESTILO UNVEIL.FR) ---
  const heroSlider = document.querySelector('.hero-slider-container');
  const slides = document.querySelectorAll('.hero-slide');
  
  if (heroSlider && slides.length > 0) {
    let introProgress = 0; // 0 = Center, 1 = Formed Carousel
    let targetProgress = 0;
    let currentProgress = 0; 
    const total = slides.length;
    
    // Variáveis de Interação e Auto-Lap (Fase 5)
    let autoLapActive = false;
    let autoLapCount = 0;
    let autoLapInterval = null;
    let isDragging = false;
    let startX = 0;
    let startProgress = 0;
    
    // Arrays para interpolar o hover e click
    let hoveredIndex = -1;
    let clickedIndex = -1;
    const hoverProgress = Array(total).fill(0);
    const clickProgress = Array(total).fill(0);

    const tooltip = document.getElementById('hero-detail-tooltip');
    const tooltipTitle = document.getElementById('tooltip-title');
    const tooltipDesc = document.getElementById('tooltip-desc');

    // --- OBSERVER TO RESET HERO WHEN SCROLLING BACK ---
    const heroSection = document.getElementById('hero');
    if (heroSection) {
      const heroObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
             // Reset back to center when scrolling back up
             if (targetProgress !== 0) {
                targetProgress = 0;
             }
             if (clickedIndex !== -1) {
                clickedIndex = -1;
                if (tooltip) tooltip.classList.remove('active');
             }
          }
        });
      }, { threshold: 0.1 });
      heroObserver.observe(heroSection);
    }


    // Funções utilitárias
    const mod = (n, m) => ((n % m) + m) % m;
    const lerp = (start, end, factor) => start + (end - start) * factor;

    const clearAutoLap = () => {
      autoLapActive = false;
      if (autoLapInterval) clearInterval(autoLapInterval);
    };

    slides.forEach((slide, i) => {
      slide.addEventListener('mouseenter', () => { 
        clearAutoLap();
        hoveredIndex = i; 
        
        // Auto-scroll no hover se não for o central e não estiver arrastando
        if (!isDragging && Math.abs(currentProgress - targetProgress) < 0.1) {
          let diff = mod(i - targetProgress, total);
          if (diff > total / 2) diff -= total;
          
          if (Math.abs(diff) > 0.1 && Math.round(diff) !== 0) {
            targetProgress += Math.sign(Math.round(diff));
            // Ao rodar, desativa o modo click
            clickedIndex = -1;
            if (tooltip) tooltip.classList.remove('active');
          }
        }
      });
      slide.addEventListener('mouseleave', () => { if (hoveredIndex === i) hoveredIndex = -1; });
    });

    const render3D = () => {
      // Controle do progresso de introdução
      if (!document.body.classList.contains('loading')) {
         introProgress = lerp(introProgress, 1, 0.025); // Velocidade do voo
         
         // Inicia o Auto-Lap mais cedo (durante a expansão)
         if (introProgress > 0.5 && !autoLapActive && autoLapCount === 0) {
            autoLapActive = true;
            autoLapInterval = setInterval(() => {
              if (!autoLapActive) {
                clearInterval(autoLapInterval);
                return;
              }
              targetProgress++;
              autoLapCount++;
              if (autoLapCount >= total) {
                clearAutoLap();
              }
            }, 400); // Dobro da velocidade (400ms)
         }
      }

      // Interpolação super suave de giro até o alvo (ease-out longo)
      currentProgress = lerp(currentProgress, targetProgress, 0.04);

      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const isMobile = vw <= 768;

      slides.forEach((slide, i) => {
        let d = mod(i - currentProgress, total);
        if (d > total / 2) d -= total;
        
        // Suavização do estado de hover
        const targetHover = (hoveredIndex === i) ? 1 : 0;
        hoverProgress[i] = lerp(hoverProgress[i], targetHover, 0.15);
        const h = hoverProgress[i];

        let x = 0, y = 0, scale = 1, opacity = 1;
        
        const rotFactor = Math.min(1, Math.abs(d));
        let rotY = 25 * rotFactor; 
        let rotX = 5 * rotFactor;

        if (d < 0) {
          x = d * (vw * 0.4); 
          y = d * (vh * -0.4);
          scale = 1 + Math.abs(d * 0.5); 
          opacity = 1 + (d * 0.8); 
        } else {
          x = d * (isMobile ? vw * 0.3 : vw * 0.22);
          y = d * (isMobile ? vh * -0.15 : vh * -0.22);
          scale = 1 - (d * 0.15); 
          opacity = 1 - (d * 0.1); 
        }

        // --- HOVER POP-OUT EFFECT ---
        x -= h * 50; 
        y -= h * 50; 
        scale += h * 0.08; 
        rotY = rotY * (1 - h); 
        rotX = rotX * (1 - h);
        
        // --- CENTER ZOOM EXPANSION (Fase 4/5) ---
        const finalX = x * introProgress;
        const finalY = y * introProgress;
        const finalScale = scale * Math.pow(introProgress, 2);
        const finalOpacity = opacity * introProgress;
        const finalRotX = rotX * introProgress;
        const finalRotY = rotY * introProgress;
        
        // --- CLICK POP-OUT EFFECT (CENTRALIZATION) ---
        let targetClick = (clickedIndex === i) ? 1 : 0;
        clickProgress[i] = lerp(clickProgress[i], targetClick, 0.1); // Suave pull para o centro
        let c = clickProgress[i];
        
        let renderX = lerp(finalX, 0, c);
        let renderY = lerp(finalY, isMobile ? -30 : -50, c); // Sobe um pouquinho para dar espaço pro texto
        let renderScale = lerp(finalScale, isMobile ? 1.4 : 1.3, c);
        let renderRotX = lerp(finalRotX, 0, c);
        let renderRotY = lerp(finalRotY, 0, c);
        
        // --- GRAYSCALE EFFECT ON CLICK ---
        let isGrayscale = false;
        if (clickedIndex !== -1 && clickedIndex !== i) {
          isGrayscale = true;
        }
        
        // Hover remove o grayscale
        if (h > 0.05) {
          isGrayscale = false;
        }

        // --- Z-INDEX DINÂMICO ---
        let zIndex = 100 - Math.round(Math.abs(d) * 10);
        if (h > 0) zIndex += Math.round(h * 200);
        
        if (clickedIndex !== -1) {
           if (clickedIndex !== i) {
              zIndex = 1; // joga pra trás
           } else {
              zIndex += 500; // selecionado pra super frente
           }
        }

        // Aplica o transform combinado (Center Zoom -> Carousel -> Clicked Center)
        if (finalOpacity <= 0.01) {
          slide.style.visibility = 'hidden';
        } else {
          slide.style.visibility = 'visible';
          slide.style.transform = `translate3d(${renderX}px, ${renderY}px, 0) scale(${renderScale}) rotateY(${renderRotY}deg) rotateX(${renderRotX}deg)`;
          slide.style.opacity = isGrayscale ? finalOpacity * 0.3 : finalOpacity;
          slide.style.filter = isGrayscale ? 'grayscale(100%)' : 'grayscale(0%)';
          slide.style.zIndex = zIndex;
          
          // Oculta o título na imagem se o tooltip dela estiver aberto
          const titleEl = slide.querySelector('.slide-title');
          if (titleEl) {
             titleEl.style.opacity = (clickedIndex === i) ? '0' : '0.9';
          }
        }
      });

      // Oculta indicador de scroll global se o tooltip estiver aberto
      const scrollMore = document.querySelector('.hero-scroll-more');
      if (scrollMore) {
        scrollMore.style.opacity = (clickedIndex !== -1) ? '0' : '';
        scrollMore.style.pointerEvents = (clickedIndex !== -1) ? 'none' : '';
      }

      requestAnimationFrame(render3D);
    };

    render3D();

    // --- LÓGICA DE DRAG / WHEEL / CLICK ---
    let startY = 0;

    const triggerLeafDrop = () => {
      const heroLeaf = document.getElementById('hero-balancing-leaf');
      if (heroLeaf && !heroLeaf.classList.contains('falling')) {
        heroLeaf.classList.add('falling');
      }
    };

    const handleDragStart = (x, y = 0) => {
      triggerLeafDrop();
      clearAutoLap();
      isDragging = true;
      startX = x;
      startY = y;
      startProgress = targetProgress;
      heroSlider.style.cursor = 'grabbing';
      clickedIndex = -1;
      if (tooltip) tooltip.classList.remove('active');
    };

    const handleDragMove = (x, y = 0, isTouch = false) => {
      if (!isDragging) return;
      const diffX = x - startX;
      const diffY = y - startY;
      
      let diff = diffX;
      if (isTouch && Math.abs(diffY) > Math.abs(diffX)) {
        diff = diffY;
      }
      
      const sensitivity = window.innerWidth * 0.6; 
      // Invertido conforme solicitação: + invés de -
      targetProgress = startProgress + (diff / sensitivity) * 3; 
    };

    const handleDragEnd = () => {
      isDragging = false;
      heroSlider.style.cursor = 'grab';
      targetProgress = Math.round(targetProgress);
    };
    heroSlider.addEventListener('mousedown', (e) => { e.preventDefault(); handleDragStart(e.clientX, e.clientY); });
    window.addEventListener('mousemove', (e) => { handleDragMove(e.clientX, e.clientY); });
    window.addEventListener('mouseup', () => { if(isDragging) handleDragEnd(); });

    heroSlider.addEventListener('touchstart', (e) => { handleDragStart(e.touches[0].clientX, e.touches[0].clientY); }, { passive: false });
    window.addEventListener('touchmove', (e) => {
      if(isDragging) {
        e.preventDefault();
        handleDragMove(e.touches[0].clientX, e.touches[0].clientY, true);
      }
    }, {passive: false});
    window.addEventListener('touchend', () => { if(isDragging) handleDragEnd(); });
    slides.forEach((slide, i) => {
      slide.addEventListener('click', (e) => {
        clearAutoLap();
        let diff = mod(i - targetProgress, total);
        if (diff > total / 2) diff -= total;
        
        if (Math.round(diff) !== 0) {
          e.preventDefault();
          targetProgress += Math.round(diff);
          clickedIndex = -1;
          if (tooltip) tooltip.classList.remove('active');
        } else {
          e.preventDefault();
          if (clickedIndex === i) {
             // Desativa se clicar novamente
             clickedIndex = -1;
             if (tooltip) tooltip.classList.remove('active');
          } else {
             // Ativa a etiqueta
             clickedIndex = i;
             if (tooltip && tooltipTitle && tooltipDesc) {
                // Usa o href da imagem para descobrir o ID da seção (ex: '#system' -> 'system')
                const slideId = slides[i].getAttribute('href').replace('#', '');
                
                // Define os atributos data-i18n para que a função translatePage atualize-os automaticamente
                tooltipTitle.setAttribute('data-i18n', `${slideId}.title`);
                tooltipDesc.setAttribute('data-i18n', `${slideId}.carouselDesc`);
                
                // Busca o título e descrição na linguagem atual a partir do arquivo de traduções
                const langData = translations[currentLang];
                let titleText = '';
                let descText = '';
                
                if (langData && langData[slideId]) {
                   titleText = langData[slideId].title || '';
                   descText = langData[slideId].carouselDesc || '';
                }
                
                tooltipTitle.textContent = titleText;
                tooltipDesc.textContent = descText;
                
                // Atualiza o texto do botão "Mais" sem apagar a seta
                const moreTextSpan = tooltip.querySelector('#tooltip-more-link .more-text');
                if (moreTextSpan) {
                   moreTextSpan.setAttribute('data-i18n', 'hero.more');
                   if (langData && langData.hero) {
                      moreTextSpan.textContent = langData.hero.more || 'Mais';
                   }
                }
                
                const tooltipMoreLink = document.getElementById('tooltip-more-link');
                const tooltipCard = tooltip.querySelector('.tooltip-content-card');
                if (tooltipMoreLink) {
                  const slideHref = slide.getAttribute('href');
                  tooltipMoreLink.href = slideHref || '#';
                  
                  // Make the entire card clickable
                  if (tooltipCard) {
                    tooltipCard.onclick = (ev) => {
                       if (slideHref && slideHref.startsWith('#')) {
                          ev.preventDefault();
                          const targetSection = document.querySelector(slideHref);
                          if (targetSection) targetSection.scrollIntoView({ behavior: 'smooth' });
                       }
                    };
                  }
                  
                  tooltipMoreLink.onclick = (ev) => {
                     ev.preventDefault();
                  };
                }
                
                tooltip.classList.add('active');
             }
          }
        }
      });
    });

    // Rodinha do mouse
    heroSlider.addEventListener('wheel', (e) => {
      e.preventDefault();
      triggerLeafDrop();
      clearAutoLap();
      const delta = Math.sign(e.deltaY) * 0.3;
      // Invertido conforme solicitação: - invés de +
      targetProgress = targetProgress - delta;
      
      // Remove clicked mode on scroll
      clickedIndex = -1;
      if (tooltip) tooltip.classList.remove('active');
      
      clearTimeout(heroSlider.wheelSnapTimeout);
      heroSlider.wheelSnapTimeout = setTimeout(() => {
        targetProgress = Math.round(targetProgress);
      }, 150);
    }, { passive: false });
  }

  // --- GLOBAL AUTO-PLAY MANAGER (5s/20s) ---
  class AutoPlayManager {
    constructor(selector, triggerEvent = 'click') {
      this.elements = Array.from(document.querySelectorAll(selector));
      this.triggerEvent = triggerEvent;
      this.currentIndex = 0;
      this.timer = null;
      this.pauseTimeout = null;
      this.isPaused = false;
      this.isIntersecting = false;
      this.init();
    }
    
    init() {
      if (this.elements.length === 0) return;
      
      // Bind user interaction (pauses timer)
      this.elements.forEach((el, idx) => {
        el.addEventListener('mousedown', () => this.handleUserInteraction(idx));
        el.addEventListener('touchstart', () => this.handleUserInteraction(idx), { passive: true });
      });

      // Also listen on the parent container to catch swipes or clicks on the cards
      const container = this.elements[0].closest('.container') || this.elements[0].closest('.carousel-3d-container') || this.elements[0].parentElement;
      if (container) {
        container.addEventListener('mousedown', () => this.handleUserInteraction(this.currentIndex));
        container.addEventListener('touchstart', () => this.handleUserInteraction(this.currentIndex), { passive: true });
      }
      
      // Observe visibility to start/stop and reset to 0 when out of view
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            this.isIntersecting = true;
            this.start();
          } else {
            this.isIntersecting = false;
            this.stop();
            // Reset to 0 when out of view (solves Issue: Arquitetos sempre começar com David Salomão)
            if (this.currentIndex !== 0) {
              this.currentIndex = 0;
              const firstEl = this.elements[0];
              if (this.triggerEvent === 'click') {
                firstEl.click();
              } else if (this.triggerEvent === 'mouseenter') {
                firstEl.dispatchEvent(new Event('mouseenter'));
              }
            }
          }
        });
      }, { threshold: 0.1 });
      
      const targetElement = this.elements[0].closest('section') || this.elements[0].parentElement;
      observer.observe(targetElement);
    }
    
    start() {
      this.stop();
      // Não inicia se estiver pausado pelo usuário ou se estiver fora da tela!
      if (this.isPaused || !this.isIntersecting) return;
      this.timer = setInterval(() => this.next(), 5000);
    }
    
    stop() {
      if (this.timer) clearInterval(this.timer);
    }
    
    handleUserInteraction(idx) {
      this.currentIndex = idx;
      this.isPaused = true;
      this.stop();
      if (this.pauseTimeout) clearTimeout(this.pauseTimeout);
      
      this.pauseTimeout = setTimeout(() => {
        this.isPaused = false;
        // O start já verifica se a seção está visível (isIntersecting)
        this.start();
      }, 20000);
    }
    
    next() {
      if (this.elements.length === 0 || this.isPaused || !this.isIntersecting) return;
      
      // Trava de segurança rigorosa: Só roda se o elemento estiver de fato dentro do viewport.
      const el = this.elements[this.currentIndex];
      const rect = el.getBoundingClientRect();
      const inView = (rect.bottom > 0 && rect.top < window.innerHeight);
      if (!inView) {
        this.stop();
        return;
      }

      this.currentIndex = (this.currentIndex + 1) % this.elements.length;
      
      // Simulate interaction without pausing (since pause listens to mousedown/touchstart)
      const nextEl = this.elements[this.currentIndex];
      if (this.triggerEvent === 'click') {
        nextEl.click();
      } else if (this.triggerEvent === 'mouseenter') {
        nextEl.dispatchEvent(new Event('mouseenter'));
      }
    }
  }

  // Initialize auto-play instances after a short delay
  setTimeout(() => {
    new AutoPlayManager('.ethics-card', 'click');
    new AutoPlayManager('.team-avatar', 'mouseenter');
    new AutoPlayManager('.tech-svg-layer', 'mouseenter');
    new AutoPlayManager('.carousel-card', 'click');
    new AutoPlayManager('.radial-ring', 'mouseenter'); // Funciona no mobile e no desktop
    
    // Comportamentos diferentes para Mobile vs Desktop
    if (window.innerWidth <= 768) {
      new AutoPlayManager('.mobile-nav-node', 'click'); // Mobile circular nav (Economia)
      new AutoPlayManager('.carousel-dots-gov .dot', 'click'); // Mobile Gov
      new AutoPlayManager('.carousel-dots-school .dot', 'click'); // Mobile School
    } else {
      new AutoPlayManager('.economy-node-card', 'click');
      new AutoPlayManager('.pipeline-step', 'mouseenter');
      new AutoPlayManager('.school-card', 'mouseenter'); // Desktop School
    }
  }, 1000);
  
  // Lógica ativação para .school-card (Desktop)
  const schoolCards = document.querySelectorAll(".school-card");
  schoolCards.forEach(card => {
    card.addEventListener("mouseenter", () => {
      schoolCards.forEach(c => c.classList.remove("active"));
      card.classList.add("active");
    });
  });

  // --- PAUSE VIDEO WHEN OUT OF VIEW ---
  const modelVideo = document.getElementById('model-video');
  if (modelVideo) {
    const videoObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) {
          modelVideo.pause();
        }
      });
    }, { threshold: 0.1 });
    videoObserver.observe(modelVideo);
  }
  
  // Clicar fora da etiqueta para fechá-la
  document.addEventListener('click', (e) => {
    const tooltip = document.querySelector('.hero-center-tooltip');
    if (tooltip && tooltip.classList.contains('active')) {
      // Se clicar dentro do tooltip ou num card, não fecha aqui
      if (tooltip.contains(e.target) || e.target.closest('.hero-slide') || e.target.closest('.hero-slider-container')) {
        return;
      }
      // Reseta clickedIndex (variável global) emitindo um wheel fake ou acessando o estado se pudéssemos
      // Mas podemos apenas fechar visualmente a etiqueta, e o drag/wheel vão resetar a classe naturalmente.
      tooltip.classList.remove('active');
    }
  });
});
