// Carrossel de depoimentos (exemplo dinâmico)
const depoimentos = [
  {
    texto: 'A Yangoa transformou nosso processo comercial. Hoje temos previsibilidade e muito mais vendas!',
    autor: 'Dra. Stephany'
  },
  {
    texto: 'O diagnóstico foi certeiro e a execução rápida. Recomendo para qualquer empresa que quer crescer.',
    autor: 'Cliente Oculto'
  }
];

let indiceAtual = 0;
const carrossel = document.querySelector('.carrossel');

function mostrarDepoimento(indice) {
  if (!carrossel) return;
  carrossel.innerHTML = `
    <blockquote>“${depoimentos[indice].texto}”</blockquote>
    <p><strong>${depoimentos[indice].autor}</strong></p>
    <button class="anterior">&#8592;</button>
    <button class="proximo">&#8594;</button>
  `;
  document.querySelector('.anterior').onclick = () => {
    indiceAtual = (indiceAtual - 1 + depoimentos.length) % depoimentos.length;
    mostrarDepoimento(indiceAtual);
  };
  document.querySelector('.proximo').onclick = () => {
    indiceAtual = (indiceAtual + 1) % depoimentos.length;
    mostrarDepoimento(indiceAtual);
  };
}

mostrarDepoimento(indiceAtual);

// Animações de entrada
window.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('section').forEach((sec, i) => {
    sec.style.opacity = 0;
    setTimeout(() => {
      sec.style.transition = 'opacity 0.8s';
      sec.style.opacity = 1;
    }, 200 + i * 200);
  });
  // Animação para carrossel de depoimentos
  if (carrossel) {
    carrossel.style.opacity = 0;
    carrossel.style.transform = 'scale(0.95)';
    setTimeout(() => {
      carrossel.style.transition = 'opacity 0.8s, transform 0.8s';
      carrossel.style.opacity = 1;
      carrossel.style.transform = 'none';
    }, 800);
  }
  // Animação para formulário de contato
  const contato = document.querySelector('.contato form');
  if (contato) {
    contato.style.opacity = 0;
    contato.style.transform = 'translateY(40px)';
    setTimeout(() => {
      contato.style.transition = 'opacity 0.8s, transform 0.8s';
      contato.style.opacity = 1;
      contato.style.transform = 'none';
    }, 1200);
  }
  // Exibir depoimentos dinâmicos na página principal
  if (carrossel) {
    // Tenta carregar depoimentos do localStorage
    let depoimentosDin = [];
    try {
      const dados = JSON.parse(localStorage.getItem('yangoa-edicao') || '{}');
      if (dados.depoimentos && Array.isArray(dados.depoimentos) && dados.depoimentos.length > 0) {
        depoimentosDin = dados.depoimentos;
      }
    } catch {}
    if (depoimentosDin.length > 0) {
      let indiceAtual = 0;
      function renderDepoimento(idx) {
        const dep = depoimentosDin[idx];
        let html = '';
        if(dep.tipo === 'texto') {
          html = `<blockquote>“${dep.texto}”</blockquote><p><strong>${dep.autor}</strong></p>`;
        } else if(dep.tipo === 'video-link') {
          // Suporte YouTube/Vimeo embed
          let embed = '';
          if(dep.link.includes('youtube.com') || dep.link.includes('youtu.be')) {
            let videoId = dep.link.split('v=')[1] || dep.link.split('/').pop();
            videoId = videoId.split('&')[0];
            embed = `<iframe width='320' height='180' src='https://www.youtube.com/embed/${videoId}' frameborder='0' allowfullscreen></iframe>`;
          } else if(dep.link.includes('vimeo.com')) {
            let videoId = dep.link.split('/').pop();
            embed = `<iframe src='https://player.vimeo.com/video/${videoId}' width='320' height='180' frameborder='0' allowfullscreen></iframe>`;
          } else {
            embed = `<a href='${dep.link}' target='_blank'>Ver vídeo</a>`;
          }
          html = `${embed}<p><strong>${dep.autor}</strong></p>`;
        } else if(dep.tipo === 'video-arquivo') {
          html = `<video width='320' height='180' controls><source src='${dep.videoBase64}'></video><p><strong>${dep.autor}</strong></p>`;
        }
        html += `<button class='anterior'>&#8592;</button><button class='proximo'>&#8594;</button>`;
        carrossel.innerHTML = html;
        carrossel.querySelector('.anterior').onclick = () => {
          indiceAtual = (indiceAtual - 1 + depoimentosDin.length) % depoimentosDin.length;
          renderDepoimento(indiceAtual);
        };
        carrossel.querySelector('.proximo').onclick = () => {
          indiceAtual = (indiceAtual + 1) % depoimentosDin.length;
          renderDepoimento(indiceAtual);
        };
      }
      renderDepoimento(indiceAtual);
    }
  }
});

// Envio do formulário (exemplo, sem backend)
document.querySelector('form').onsubmit = function(e) {
  e.preventDefault();
  alert('Mensagem enviada! Em breve entraremos em contato.');
  this.reset();
};

// Navegação suave para âncoras
const links = document.querySelectorAll('nav ul li a[href^="#"]');
links.forEach(link => {
  link.addEventListener('click', function(e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      window.scrollTo({
        top: target.offsetTop - 70,
        behavior: 'smooth'
      });
    }
  });
});

// Destaque do menu ao rolar
window.addEventListener('scroll', () => {
  const sections = document.querySelectorAll('main section');
  let scrollPos = window.scrollY + 100;
  sections.forEach(sec => {
    const id = sec.getAttribute('id');
    if (id && sec.offsetTop <= scrollPos && sec.offsetTop + sec.offsetHeight > scrollPos) {
      document.querySelectorAll('nav ul li a').forEach(a => a.classList.remove('active'));
      const activeLink = document.querySelector('nav ul li a[href="#'+id+'"]');
      if (activeLink) activeLink.classList.add('active');
    }
  });
});

// Função de shake para erro de login (pode ser usada no admin-login.html)
function shakeInput(input) {
  input.style.animation = 'shake 0.3s';
  input.addEventListener('animationend', () => {
    input.style.animation = '';
  }, { once: true });
}

// Fade/slide nas seções ao rolar
function animarSecoes() {
  const secoes = document.querySelectorAll('section[data-animate]');
  const ativar = () => {
    secoes.forEach(sec => {
      const rect = sec.getBoundingClientRect();
      if(rect.top < window.innerHeight - 80) sec.classList.add('active');
    });
  };
  ativar();
  window.addEventListener('scroll', ativar);
}
window.addEventListener('DOMContentLoaded', animarSecoes);

// Barra de progresso no formulário de contato
const form = document.querySelector('.contato form');
if(form) {
  form.onsubmit = function(e) {
    e.preventDefault();
    const progress = document.getElementById('form-progress');
    progress.style.width = '0';
    progress.style.display = 'block';
    setTimeout(()=>progress.style.width = '100%', 50);
    setTimeout(()=>{
      alert('Mensagem enviada! Em breve entraremos em contato.');
      progress.style.width = '0';
      form.reset();
    }, 1200);
  };
}

// Confete/check ao salvar na área admin
if(window.location.pathname.includes('admin-edit.html')) {
  const formEdit = document.getElementById('form-edicao');
  if(formEdit) {
    const msg = document.getElementById('msg-sucesso');
    formEdit.addEventListener('submit', function() {
      // Confete
      const conf = document.createElement('div');
      conf.className = 'confete';
      conf.innerHTML = '🎉';
      document.body.appendChild(conf);
      setTimeout(()=>conf.remove(), 1200);
      // Check animado
      msg.innerHTML = '<span class="check-anim">✔</span> Alterações salvas localmente!';
      setTimeout(()=>{msg.innerHTML = 'Alterações salvas localmente!';}, 1500);
    });
  }
}

// Carrossel: transição suave
function carrosselTransicaoSuave() {
  const carrossel = document.querySelector('.carrossel');
  if (!carrossel) return;
  let lastIdx = 0;
  let depoimentosDin = [];
  try {
    const dados = JSON.parse(localStorage.getItem('yangoa-edicao') || '{}');
    if (dados.depoimentos && Array.isArray(dados.depoimentos) && dados.depoimentos.length > 0) {
      depoimentosDin = dados.depoimentos;
    }
  } catch {}
  if (depoimentosDin.length > 0) {
    let indiceAtual = 0;
    function renderDepoimento(idx, animDir) {
      const dep = depoimentosDin[idx];
      let html = '';
      if(dep.tipo === 'texto') {
        html = `<blockquote>“${dep.texto}”</blockquote><p><strong>${dep.autor}</strong></p>`;
      } else if(dep.tipo === 'video-link') {
        let embed = '';
        if(dep.link.includes('youtube.com') || dep.link.includes('youtu.be')) {
          let videoId = dep.link.split('v=')[1] || dep.link.split('/').pop();
          videoId = videoId.split('&')[0];
          embed = `<iframe width='320' height='180' src='https://www.youtube.com/embed/${videoId}' frameborder='0' allowfullscreen></iframe>`;
        } else if(dep.link.includes('vimeo.com')) {
          let videoId = dep.link.split('/').pop();
          embed = `<iframe src='https://player.vimeo.com/video/${videoId}' width='320' height='180' frameborder='0' allowfullscreen></iframe>`;
        } else {
          embed = `<a href='${dep.link}' target='_blank'>Ver vídeo</a>`;
        }
        html = `${embed}<p><strong>${dep.autor}</strong></p>`;
      } else if(dep.tipo === 'video-arquivo') {
        html = `<video width='320' height='180' controls><source src='${dep.videoBase64}'></video><p><strong>${dep.autor}</strong></p>`;
      }
      html += `<button class='anterior'>&#8592;</button><button class='proximo'>&#8594;</button>`;
      carrossel.style.opacity = 0;
      carrossel.style.transform = animDir === 'left' ? 'translateX(-40px)' : animDir === 'right' ? 'translateX(40px)' : 'scale(0.95)';
      setTimeout(()=>{
        carrossel.innerHTML = html;
        carrossel.style.opacity = 1;
        carrossel.style.transform = 'none';
        carrossel.querySelector('.anterior').onclick = () => {
          lastIdx = indiceAtual;
          indiceAtual = (indiceAtual - 1 + depoimentosDin.length) % depoimentosDin.length;
          renderDepoimento(indiceAtual, 'left');
        };
        carrossel.querySelector('.proximo').onclick = () => {
          lastIdx = indiceAtual;
          indiceAtual = (indiceAtual + 1) % depoimentosDin.length;
          renderDepoimento(indiceAtual, 'right');
        };
      }, 250);
    }
    renderDepoimento(indiceAtual);
  }
}
window.addEventListener('DOMContentLoaded', carrosselTransicaoSuave);

// Animação de digitação só uma vez
window.addEventListener('DOMContentLoaded', () => {
  const h1 = document.querySelector('.hero h1.typing');
  if(h1) {
    setTimeout(()=>h1.classList.remove('typing'), 3200);
  }
}); 