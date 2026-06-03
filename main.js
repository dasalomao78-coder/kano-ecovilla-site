import { translations } from './translations.js';

document.addEventListener("DOMContentLoaded", () => {
  // --- INICIALIZAÇÃO DE IDIOMA DE PREFERÊNCIA ---
  let currentLang = "pt"; // Padrão PT
  
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
  const langText = langToggle ? langToggle.querySelector(".lang-text") : null;
  
  const translatePage = (lang) => {
    currentLang = lang;
    
    // Atualiza o atributo lang do HTML
    document.documentElement.lang = lang;
    
    // Atualiza o texto do botão
    if (langText) {
      langText.textContent = lang === "pt" ? "EN" : "PT";
    }
    
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
  
  if (langToggle) {
    langToggle.addEventListener("click", () => {
      const newLang = currentLang === "pt" ? "en" : "pt";
      translatePage(newLang);
    });
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
    const handleLayerActivation = () => {
      const targetIdx = layer.getAttribute("data-target");
      
      // Destaca a camada isométrica
      isoLayers.forEach(l => l.classList.remove("active"));
      layer.classList.add("active");
      
      // Destaca o bloco de informações correspondente
      techBlocks.forEach(block => {
        block.classList.remove("active");
        if (block.getAttribute("data-index") === targetIdx) {
          block.classList.add("active");
          // Rola suavemente até o bloco se em mobile
          if (window.innerWidth <= 1024) {
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

    // Rotação automática a cada 3 segundos
    setInterval(() => {
      if (window.innerWidth > 768) return; // Só roda no mobile
      const scrollPos = container.scrollLeft;
      const itemWidth = container.scrollWidth / items.length;
      let currentIndex = Math.round(scrollPos / itemWidth);
      
      let nextIndex = currentIndex + 1;
      if (nextIndex >= dots.length) {
        nextIndex = 0;
      }
      container.scrollTo({ left: nextIndex * itemWidth, behavior: 'smooth' });
    }, 3000);
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
    let targetProgress = 0;
    let currentProgress = 0;
    const maxProgress = slides.length - 1;
    
    // Variáveis de Interação
    let isDragging = false;
    let startX = 0;
    let startProgress = 0;
    
    // Arrays para interpolar o hover
    let hoveredIndex = -1;
    const hoverProgress = Array(slides.length).fill(0);

    slides.forEach((slide, i) => {
      slide.addEventListener('mouseenter', () => { hoveredIndex = i; });
      slide.addEventListener('mouseleave', () => { if (hoveredIndex === i) hoveredIndex = -1; });
    });
    
    // Função de Lerp para suavizar movimentos
    const lerp = (start, end, factor) => start + (end - start) * factor;

    const render3D = () => {
      // Interpola suavemente o progresso atual até o alvo
      currentProgress = lerp(currentProgress, targetProgress, 0.08);

      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const isMobile = vw <= 768;

      slides.forEach((slide, i) => {
        const d = i - currentProgress; 
        
        // Suavização do estado de hover
        const targetHover = (hoveredIndex === i) ? 1 : 0;
        hoverProgress[i] = lerp(hoverProgress[i], targetHover, 0.15);
        const h = hoverProgress[i];

        let x = 0, y = 0, scale = 1, opacity = 1;
        
        // Cartas viradas de lado, MAS a carta principal (d = 0) fica totalmente de frente
        // Usamos Math.min(1, Math.abs(d)) para criar uma transição suave:
        // Quando a carta chega no centro, a rotação zera. Quando sai, volta a inclinar.
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

        if (opacity <= 0 && h < 0.01) {
          slide.style.visibility = 'hidden';
        } else {
          slide.style.visibility = 'visible';
          let zIndex = 100 - Math.round(Math.abs(d) * 10);
          if (h > 0) zIndex += Math.round(h * 200); // Traz pra frente no hover
          
          slide.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${scale}) rotateY(${rotY}deg) rotateX(${rotX}deg)`;
          slide.style.opacity = opacity;
          slide.style.zIndex = zIndex;
        }
      });

      requestAnimationFrame(render3D);
    };

    render3D();

    // --- LÓGICA DE DRAG / WHEEL / CLICK ---
    const handleDragStart = (x) => {
      isDragging = true;
      startX = x;
      startProgress = targetProgress;
      heroSlider.style.cursor = 'grabbing';
    };

    const handleDragMove = (x) => {
      if (!isDragging) return;
      const diffX = x - startX;
      const sensitivity = window.innerWidth * 0.6; 
      let newProgress = startProgress - (diffX / sensitivity) * 3; 
      targetProgress = Math.max(0, Math.min(maxProgress, newProgress));
    };

    const handleDragEnd = () => {
      isDragging = false;
      heroSlider.style.cursor = 'grab';
      targetProgress = Math.round(targetProgress);
    };

    heroSlider.addEventListener('mousedown', (e) => { e.preventDefault(); handleDragStart(e.clientX); });
    window.addEventListener('mousemove', (e) => { handleDragMove(e.clientX); });
    window.addEventListener('mouseup', () => { if(isDragging) handleDragEnd(); });

    heroSlider.addEventListener('touchstart', (e) => { handleDragStart(e.touches[0].clientX); });
    window.addEventListener('touchmove', (e) => {
      if(isDragging) handleDragMove(e.touches[0].clientX);
    }, {passive: false});
    window.addEventListener('touchend', () => { if(isDragging) handleDragEnd(); });

    slides.forEach((slide, i) => {
      slide.addEventListener('click', (e) => {
        if (Math.round(targetProgress) !== i) {
          e.preventDefault();
          targetProgress = i;
        } else {
          e.preventDefault();
          const targetId = slide.getAttribute('href');
          if (targetId && targetId.startsWith('#')) {
            const targetSection = document.querySelector(targetId);
            if (targetSection) targetSection.scrollIntoView({ behavior: 'smooth' });
          }
        }
      });
    });

    // Rodinha do mouse
    heroSlider.addEventListener('wheel', (e) => {
      e.preventDefault();
      const delta = Math.sign(e.deltaY) * 0.3;
      targetProgress = Math.max(0, Math.min(maxProgress, targetProgress + delta));
      clearTimeout(heroSlider.wheelSnapTimeout);
      heroSlider.wheelSnapTimeout = setTimeout(() => {
        targetProgress = Math.round(targetProgress);
      }, 150);
    }, { passive: false });
  }
});
