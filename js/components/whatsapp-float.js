// Floating WhatsApp button logic
export function addFloatingWhatsappButton() {
  // Prevent duplicate button
  if (document.getElementById('floating-whatsapp-btn')) return;

  const btn = document.createElement('a');
  btn.id = 'floating-whatsapp-btn';
  btn.href = 'https://wa.me/917303062845';
  btn.target = '_blank';
  btn.rel = 'noopener noreferrer';
  btn.setAttribute('aria-label', 'Chat with us on WhatsApp');
  btn.style.position = 'fixed';
  btn.style.bottom = '28px';
  btn.style.right = '28px';
  btn.style.zIndex = '9999';
  btn.style.display = 'flex';
  btn.style.alignItems = 'center';
  btn.style.justifyContent = 'center';
  btn.style.width = '64px';
  btn.style.height = '64px';
  btn.style.background = '#25D366';
  btn.style.borderRadius = '50%';
  btn.style.boxShadow = '0 4px 24px 0 rgba(0,0,0,0.18)';
  btn.style.transition = 'transform 0.2s';
  btn.style.cursor = 'pointer';

  btn.innerHTML = `
    <i class="fab fa-whatsapp" style="font-size:2.2rem;color:white;"></i>
    <span style="position:absolute;left:-9999px;">Chat on WhatsApp: 7303062845</span>
  `;

  // Add hover effect
  btn.addEventListener('mouseenter', () => {
    btn.style.transform = 'scale(1.08)';
  });
  btn.addEventListener('mouseleave', () => {
    btn.style.transform = 'scale(1)';
  });

  document.body.appendChild(btn);
}
