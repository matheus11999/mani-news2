export function shareToWhatsApp(url: string, title: string) {
  const text = encodeURIComponent(`${title}\n\n${url}`);
  
  // Check if Web Share API is available and supports sharing URLs
  if (navigator.share && navigator.canShare && navigator.canShare({ url })) {
    navigator.share({
      title,
      url,
    }).catch((error) => {
      console.error('Error sharing:', error);
      // Fallback to WhatsApp direct link
      openWhatsAppLink(text);
    });
  } else {
    // Direct WhatsApp link
    openWhatsAppLink(text);
  }
}

function openWhatsAppLink(text: string) {
  const whatsappUrl = `https://wa.me/?text=${text}`;
  window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
}

export function shareToFacebook(url: string) {
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
  window.open(facebookUrl, '_blank', 'noopener,noreferrer,width=600,height=400');
}

export function shareToTwitter(url: string, title: string) {
  const text = encodeURIComponent(title);
  const twitterUrl = `https://twitter.com/intent/tweet?text=${text}&url=${encodeURIComponent(url)}`;
  window.open(twitterUrl, '_blank', 'noopener,noreferrer,width=600,height=400');
}

export function copyToClipboard(text: string) {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(() => {
      // You could show a toast notification here
      alert('Link copiado para a área de transferência!');
    }).catch((error) => {
      console.error('Error copying to clipboard:', error);
      fallbackCopyToClipboard(text);
    });
  } else {
    fallbackCopyToClipboard(text);
  }
}

function fallbackCopyToClipboard(text: string) {
  const textArea = document.createElement('textarea');
  textArea.value = text;
  textArea.style.position = 'fixed';
  textArea.style.left = '-999999px';
  textArea.style.top = '-999999px';
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();
  
  try {
    document.execCommand('copy');
    alert('Link copiado para a área de transferência!');
  } catch (error) {
    console.error('Error copying to clipboard:', error);
    alert('Não foi possível copiar o link. Tente selecionar e copiar manualmente.');
  }
  
  document.body.removeChild(textArea);
}
