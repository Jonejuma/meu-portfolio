      (function () {
        "use strict";

        /* ── SANITIZAÇÃO ─────────────────────────────────────────────────────────── */
        function sanitize(str) {
          if (typeof str !== "string") return "";
          return str
            .trim()
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#x27;")
            .replace(/\//g, "&#x2F;");
        }

        /* ── EMAIL OBFUSCATION (protege do scraping de bots) ────────────────────── */
        /* O endereço está dividido e só é montado em runtime pelo JS.               */
        /* Bots que não executam JS nunca vêem o endereço completo.                  */
        const _u = "jonejumaamadeofficial";
        const _d = "gmail";
        const _t = "com";
        const email = _u + "@" + _d + "." + _t;
        const emailEl = document.getElementById("emailDisplay");
        const emailLink = document.getElementById("emailLink");
        if (emailEl && emailLink) {
          emailEl.textContent = email;
          emailLink.href = "mailto:" + email;
        }

        /* ── CURSOR PERSONALIZADO ────────────────────────────────────────────────── */
        const cursor = document.getElementById("cursor");
        const ring = document.getElementById("cursorRing");
        let mx = 0,
          my = 0,
          rx = 0,
          ry = 0;
        document.addEventListener(
          "mousemove",
          function (e) {
            mx = e.clientX;
            my = e.clientY;
            cursor.style.left = mx + "px";
            cursor.style.top = my + "px";
          },
          { passive: true },
        );
        (function loop() {
          rx += (mx - rx) * 0.12;
          ry += (my - ry) * 0.12;
          ring.style.left = rx + "px";
          ring.style.top = ry + "px";
          requestAnimationFrame(loop);
        })();
        document
          .querySelectorAll(
            "a,button,input,textarea,select,.service-item,.port-card,.skill-card,.process-step,.testimonial-card",
          )
          .forEach(function (el) {
            el.addEventListener("mouseenter", function () {
              cursor.style.width = "16px";
              cursor.style.height = "16px";
              ring.style.width = "52px";
              ring.style.height = "52px";
            });
            el.addEventListener("mouseleave", function () {
              cursor.style.width = "10px";
              cursor.style.height = "10px";
              ring.style.width = "36px";
              ring.style.height = "36px";
            });
          });

        /* ── NAV + BACK TO TOP ───────────────────────────────────────────────────── */
        var nav = document.getElementById("nav");
        var bt = document.getElementById("backTop");
        
        /* ── MENU MOBILE ─────────────────────────────────────────── */
        var hamburger   = document.getElementById('hamburger');
        var mobileMenu  = document.getElementById('mobileMenu');
        
        function toggleMenu() {
          hamburger.classList.toggle('open');
          mobileMenu.classList.toggle('open');
          document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
        }
        
        hamburger.addEventListener('click', toggleMenu);

        /* Fecha ao clicar no fundo */
        mobileMenu.addEventListener('click', function(e) {
          if (e.target === mobileMenu) toggleMenu();
        });
      
        /* Fecha ao clicar num link */
        mobileMenu.querySelectorAll('a').forEach(function(link) {
          link.addEventListener('click', function() {
            hamburger.classList.remove('open');
            mobileMenu.classList.remove('open');
            document.body.style.overflow = '';
          });
        });
        window.addEventListener(
          "scroll",
          function () {
            nav.classList.toggle("scrolled", window.scrollY > 50);
            bt.classList.toggle("visible", window.scrollY > 400);
          },
          { passive: true },
        );
        bt.addEventListener("click", function () {
          window.scrollTo({ top: 0, behavior: "smooth" });
        });

        /* ── REVEAL ON SCROLL ────────────────────────────────────────────────────── */
        var obs = new IntersectionObserver(
          function (entries) {
            entries.forEach(function (e) {
              if (e.isIntersecting) e.target.classList.add("visible");
            });
          },
          { threshold: 0.08 },
        );
        document.querySelectorAll(".reveal").forEach(function (r) {
          obs.observe(r);
        });

        /* ── VALIDAÇÃO DE FORMULÁRIO ─────────────────────────────────────────────── */
        function showErr(id, show) {
          var el = document.getElementById(id);
          if (el) el.style.display = show ? "block" : "none";
        }
        function validateEmail(v) {
          return /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/.test(v);
        }
        function validateName(v) {
          return (
            v.length >= 2 && v.length <= 100 && /^[\p{L}\s'\-\.]+$/u.test(v)
          );
        }
        function validateMessage(v) {
          return v.trim().length >= 10 && v.trim().length <= 2000;
        }
        function validatePhone(v) {
          if (!v) return true; // opcional
          return /^[\+\d\s\-\(\)]{7,20}$/.test(v);
        }

        /* ── RATE LIMITING DO FORMULÁRIO (client-side — complemento ao .htaccess) ── */
        var _lastSubmit  = parseInt(sessionStorage.getItem('ls') || '0');
        var _submitCount = parseInt(sessionStorage.getItem('sc') || '0');
        var COOLDOWN_MS = 30000; // 30s entre envios
        var MAX_SUBMITS = 3; // max 3 tentativas por sessão

        document
          .getElementById("contactForm")
          .addEventListener("submit", function (e) {
            e.preventDefault();
            var now = Date.now();
            var btn = document.getElementById("submitBtn");
            var successEl = document.getElementById("formSuccess");

            /* Rate limit */
            if (_submitCount >= MAX_SUBMITS) {
              alert(
                "Muitas tentativas. Por favor tenta mais tarde ou contacta directamente via WhatsApp.",
              );
              return;
            }
            if (now - _lastSubmit < COOLDOWN_MS && _lastSubmit !== 0) {
              var wait = Math.ceil((COOLDOWN_MS - (now - _lastSubmit)) / 1000);
              alert(
                "Por favor aguarda " +
                  wait +
                  " segundos antes de enviar novamente.",
              );
              return;
            }

            /* Leitura dos valores */
            var nome = document.getElementById("fieldNome").value;
            var tel = document.getElementById("fieldTel").value;
            var emailVal = document.getElementById("fieldEmail").value;
            var servico = document.getElementById("fieldServico").value;
            var msg = document.getElementById("fieldMsg").value;

            /* Validação rigorosa */
            var valid = true;
            showErr("errNome", !validateName(nome));
            if (!validateName(nome)) valid = false;
            showErr("errEmail", !validateEmail(emailVal));
            if (!validateEmail(emailVal)) valid = false;
            showErr("errServico", !servico);
            if (!servico) valid = false;
            showErr("errMsg", !validateMessage(msg));
            if (!validateMessage(msg)) valid = false;
            if (!validatePhone(tel)) {
              valid = false;
              alert("Número de telefone inválido.");
            }
            if (!valid) return;

            /* Sanitização antes de usar em qualquer contexto */
            var sNome = sanitize(nome);
            var sTel = sanitize(tel);
            var sEmail = sanitize(emailVal);
            var sServico = sanitize(servico);
            var sMsg = sanitize(msg);

            /* Construção segura do mailto (nunca innerHTML) */
            var subject = "Pedido de orçamento — " + sServico;
            var body =
              "Nome: " +
              sNome +
              "\nTelefone: " +
              sTel +
              "\nEmail: " +
              sEmail +
              "\nServiço: " +
              sServico +
              "\n\nMensagem:\n" +
              sMsg;

            /* Desactiva botão durante o envio */
            btn.disabled = true;
            btn.textContent = "A enviar...";

            fetch("https://formspree.io/f/xojpdnvw", {
              method: "POST",
              headers: { "Accept": "application/json" },
              body: new FormData(document.getElementById("contactForm"))
            })
            .then(function(response) {
              if (response.ok) {
                document.getElementById("fieldNome").value    = "";
                document.getElementById("fieldTel").value     = "";
                document.getElementById("fieldEmail").value   = "";
                document.getElementById("fieldServico").value = "";
                document.getElementById("fieldMsg").value     = "";

                ["errNome","errEmail","errServico","errMsg"].forEach(function(id){
                  var el = document.getElementById(id);
                  if(el) el.style.display = "none";
                });

                document.querySelector('input[name="_replyto"]').value = document.getElementById("fieldEmail").value;
                successEl.style.display = "block";
                _lastSubmit = Date.now();
                _submitCount++;
                sessionStorage.setItem('ls', _lastSubmit);
                sessionStorage.setItem('sc', _submitCount);

                setTimeout(function() {
                  successEl.style.display = "none";
                  btn.disabled    = false;
                  btn.textContent = "Enviar mensagem →";
                }, 6000);
              } else {
                return response.json().then(function(data) {
                  var msg = (data && data.errors)
                    ? data.errors.map(function(e){ return e.message; }).join(", ")
                    : "Erro ao enviar. Por favor tenta via WhatsApp.";
                  alert(msg);
                  btn.disabled    = false;
                  btn.textContent = "Enviar mensagem →";
                });
              }
            })
            .catch(function() {
              alert("Sem ligação. Por favor tenta via WhatsApp: +258 86 675 7428");
              btn.disabled    = false;
              btn.textContent = "Enviar mensagem →";
            });
          });
      })(); // IIFE — nenhuma variável vaza para o scope global


      (function () {
        function sanitize(input) {
          return input.replace(/[<>&"'`]/g, function (c) {
            return {
              "<": "&lt;",
              ">": "&gt;",
              "&": "&amp;",
              '"': "&quot;",
              "'": "&#39;",
              "`": "&#96;",
            }[c];
          });
        }

        try {
          var stored = JSON.parse(localStorage.getItem("rateLimit") || "{}");
          if (stored.lastSubmit) lastSubmit = stored.lastSubmit;
          if (stored.submitCount) submitCount = stored.submitCount;
        } catch (e) {}

        function persist() {
          localStorage.setItem(
            "rateLimit",
            JSON.stringify({
              lastSubmit: lastSubmit,
              submitCount: submitCount,
            }),
          );
        }

        var form = document.querySelector("form");
        if (form) {
          form.addEventListener("submit", function (e) {
            var now = Date.now();

            if (now - lastSubmit < 5000 || submitCount > 5) {
              e.preventDefault();
              alert("Too many requests. Try again later.");
              return;
            }

            var inputs = form.querySelectorAll("input, textarea");
            inputs.forEach(function (input) {
              input.value = sanitize(input.value);
            });

            lastSubmit = now;
            submitCount++;
            persist();
          });
        }
      })();
