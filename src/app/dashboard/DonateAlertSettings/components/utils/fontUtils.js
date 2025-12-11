export const fontFamilies = {
  default: "'Kanit', sans-serif",
  prompt: "'Prompt', sans-serif",
  sarabun: "'Sarabun', sans-serif",
  noto: "'Noto Sans Thai', sans-serif",
  ibmplex: "'IBM Plex Sans Thai", sans-serif", 
};

export const getFontWeight = (weight) => {
  switch (weight) {
    case 'normal': return '400';
    case 'medium': return '500'; 
    case 'bold': return '700';
    case 'extrabold': return '800';
    default: return '400';
  }
};

export const getDisplayName = (prefixText) => {
  return prefixText.includes("{{user}}") 
    ? prefixText.replace("{{user}}", "JohnDoe")
    : prefixText;
};

export const getAmountText = (settings) => {
  if (settings.amountText) {
    return settings.amountText.replace("{{amount}}", "100");
  }
  return `100${settings.amountSuffix || '฿'}`;
};