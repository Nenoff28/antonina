'use strict';

const menuButton = document.querySelector('.menu-button');
const mobileNav = document.getElementById('mobile-nav');
function closeMenu() {
  if (!menuButton || !mobileNav) return;
  mobileNav.hidden = true;
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', 'Отвори менюто');
}
if (menuButton && mobileNav) {
  menuButton.addEventListener('click', () => {
    const expanded = menuButton.getAttribute('aria-expanded') === 'true';
    mobileNav.hidden = expanded;
    menuButton.setAttribute('aria-expanded', String(!expanded));
    menuButton.setAttribute('aria-label', expanded ? 'Отвори менюто' : 'Затвори менюто');
  });
  mobileNav.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && !mobileNav.hidden) { closeMenu(); menuButton.focus(); }
  });
  window.matchMedia('(min-width: 1101px)').addEventListener('change', event => { if (event.matches) closeMenu(); });
}

const dialog = document.getElementById('document-dialog');
let lastDocumentButton = null;
if (dialog) {
  const image = document.getElementById('dialog-image');
  const title = document.getElementById('dialog-title');
  const download = document.getElementById('dialog-download');
  document.querySelectorAll('[data-document]').forEach(button => {
    button.addEventListener('click', () => {
      lastDocumentButton = button;
      image.src = button.dataset.document;
      image.alt = button.dataset.title;
      title.textContent = button.dataset.title;
      download.href = button.dataset.document;
      dialog.showModal();
      document.body.classList.add('dialog-open');
    });
  });
  dialog.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
  dialog.addEventListener('close', () => {
    document.body.classList.remove('dialog-open');
    if (lastDocumentButton) lastDocumentButton.focus();
  });
}

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
if ('IntersectionObserver' in window && !reducedMotion.matches) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); }
    });
  }, { threshold: 0.08 });
  document.querySelectorAll('.reveal').forEach(element => { element.classList.add('will-reveal'); observer.observe(element); });
}

const form = document.getElementById('contact-form');
if (form) {
  const status = document.getElementById('form-status');
  const submitButton = form.querySelector('button[type="submit"]');
  const originalButtonHtml = submitButton.innerHTML;
  const fields = ['name', 'phone', 'email', 'message', 'consent'];
  function errorFor(id) {
    const el = document.getElementById(id);
    if (id === 'name' && el.value.trim().length < 2) return 'Моля, въведете име с поне 2 символа.';
    if (id === 'phone' && el.value.trim() && !/^\+?[\d\s()\-]{6,30}$/.test(el.value.trim())) return 'Моля, въведете валиден телефон или оставете полето празно.';
    if (id === 'email' && (!el.value.trim() || !el.validity.valid)) return 'Моля, въведете валиден имейл адрес.';
    if (id === 'message' && el.value.trim().length < 10) return 'Моля, въведете кратко запитване с поне 10 символа.';
    if (id === 'consent' && !el.checked) return 'Необходимо е съгласие за обработване на данните за отговор.';
    return '';
  }
  function displayError(id, message) {
    const input = document.getElementById(id);
    const error = document.getElementById(id + '-error');
    error.textContent = message;
    input.setAttribute('aria-invalid', message ? 'true' : 'false');
    if (message) input.setAttribute('aria-describedby', error.id);
    else input.removeAttribute('aria-describedby');
  }
  fields.forEach(id => {
    const input = document.getElementById(id);
    input.addEventListener(id === 'consent' ? 'change' : 'input', () => { if (input.getAttribute('aria-invalid') === 'true') displayError(id, errorFor(id)); });
  });
  form.addEventListener('submit', async event => {
    event.preventDefault();
    status.textContent = '';
    let firstInvalid = null;
    fields.forEach(id => {
      const message = errorFor(id);
      displayError(id, message);
      if (message && !firstInvalid) firstInvalid = document.getElementById(id);
    });
    if (firstInvalid) { status.textContent = 'Проверете отбелязаните полета.'; firstInvalid.focus(); return; }
    if (document.getElementById('website').value) { status.textContent = 'Запитването не може да бъде обработено.'; return; }
    const endpoint = form.dataset.endpoint;
    if (!endpoint) {
      const body = `Име: ${document.getElementById('name').value.trim()}\nИмейл: ${document.getElementById('email').value.trim()}\nТелефон: ${document.getElementById('phone').value.trim() || 'Не е посочен'}\n\n${document.getElementById('message').value.trim()}\n\nСъгласие: данните да бъдат използвани за отговор на това запитване.`;
      const href = `mailto:${form.dataset.email}?subject=${encodeURIComponent('Запитване за онлайн консултация')}&body=${encodeURIComponent(body)}`;
      window.location.href = href;
      status.textContent = 'Имейлът е подготвен. Изпратете го от пощенската си програма. Ако тя не се отвори, пишете директно на ' + form.dataset.email + '.';
      return;
    }
    if (!/^https:\/\/formspree\.io\/f\/[a-zA-Z0-9]+$/.test(endpoint)) {
      status.textContent = 'Изпращането не е настроено правилно. Моля, използвайте директния имейл или телефона.';
      return;
    }
    submitButton.disabled = true;
    submitButton.textContent = 'Изпращане…';
    try {
      const response = await fetch(endpoint, { method: 'POST', body: new FormData(form), headers: { 'Accept': 'application/json' } });
      if (!response.ok) throw new Error('submission_failed');
      status.textContent = 'Запитването е изпратено успешно. Това не е автоматично потвърждение на час.';
      form.reset();
    } catch {
      status.textContent = 'Запитването не беше изпратено. Опитайте отново или използвайте директния имейл/телефон. Данните ви остават във формата.';
    } finally {
      submitButton.disabled = false;
      submitButton.innerHTML = originalButtonHtml;
    }
  });
}
