const normalizeMetadataFontWeight = (weight) => {
  if (typeof weight === 'number') return `${weight}`;
  const normalized = String(weight || '').trim().toLowerCase();
  const weightMap = {
    thin: '100',
    extralight: '200',
    'extra-light': '200',
    light: '300',
    normal: '400',
    medium: '500',
    semibold: '600',
    'semi-bold': '600',
    bold: '700',
    extrabold: '800',
    'extra-bold': '800',
    black: '900',
  };
  return weightMap[normalized] || weight || '400';
};

export const toThaiDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '';
  const year = date.getFullYear() + 543;
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hours = date.getHours();
  const minutes = date.getMinutes();
  return `${day.toString().padStart(2, '0')}/${month.toString().padStart(2, '0')}/${year} ${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
};

export const fromThaiDate = (thaiDateString) => {
  if (!thaiDateString) return '';
  const parts = thaiDateString.trim().split(' ');
  const datePart = parts[0];
  const timePart = parts[1] || '00:00';
  const [day, month, thaiYear] = datePart.split('/');
  if (!day || !month || !thaiYear) return '';
  const year = parseInt(thaiYear, 10) - 543;
  const paddedMonth = month.toString().padStart(2, '0');
  const paddedDay = day.toString().padStart(2, '0');
  return `${year}-${paddedMonth}-${paddedDay}T${timePart}`;
};

export const getResetDates = () => {
  const now = new Date();
  const end = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
  return {
    startAt: now.toISOString().slice(0, 16),
    endAt: end.toISOString().slice(0, 16),
  };
};

export const toMetadata = (settings) => {
  return {
    type: 'LEADERBOARD',
    metadata: {
      type: settings.layoutStyle,
      title: {
        text: settings.titleText,
        fontFamily: settings.titleFontFamily,
        fontWeight: normalizeMetadataFontWeight(settings.titleFontWeight),
        fontSize: parseInt(settings.titleFontSize, 10),
        color: settings.titleColor,
        strokeWidth: parseFloat(settings.titleStrokeWidth),
        strokeColor: settings.titleStrokeColor,
        alignment: settings.titleAlignment,
      },
      list: {
        count: settings.maxEntries,
        fontFamily: settings.listFontFamily,
        fontWeight: normalizeMetadataFontWeight(settings.listFontWeight),
        fontSize: parseInt(settings.listFontSize, 10),
        color: settings.listColor,
        amountColor: settings.listAmountColor,
        strokeWidth: parseFloat(settings.listStrokeWidth),
        strokeColor: settings.listStrokeColor,
      },
      isUseStartAt: settings.isUseStartAt,
      startAt: settings.isUseStartAt ? new Date(settings.startAt).getTime() : null,
      isUseEndAt: settings.isUseEndAt,
      endAt: settings.isUseEndAt ? new Date(settings.endAt).getTime() : null,
      podium: {
        firstFontFamily: settings.podiumFirstFontFamily,
        firstFontWeight: normalizeMetadataFontWeight(settings.podiumFirstFontWeight),
        firstUsernameFontSize: parseInt(settings.podiumFirstUsernameFontSize, 10),
        firstUsernameColor: settings.podiumFirstUsernameColor,
        firstAmountFontSize: parseInt(settings.podiumFirstAmountFontSize, 10),
        firstAmountColor: settings.podiumFirstAmountColor,
        firstStrokeWidth: parseFloat(settings.podiumFirstStrokeWidth),
        firstStrokeColor: settings.podiumFirstStrokeColor,
        firstShine: settings.podiumFirstShine,
        secondFontFamily: settings.podiumSecondFontFamily,
        secondFontWeight: normalizeMetadataFontWeight(settings.podiumSecondFontWeight),
        secondUsernameFontSize: parseInt(settings.podiumSecondUsernameFontSize, 10),
        secondUsernameColor: settings.podiumSecondUsernameColor,
        secondAmountFontSize: parseInt(settings.podiumSecondAmountFontSize, 10),
        secondAmountColor: settings.podiumSecondAmountColor,
        secondStrokeWidth: parseFloat(settings.podiumSecondStrokeWidth),
        secondStrokeColor: settings.podiumSecondStrokeColor,
        thirdFontFamily: settings.podiumThirdFontFamily,
        thirdFontWeight: normalizeMetadataFontWeight(settings.podiumThirdFontWeight),
        thirdUsernameFontSize: parseInt(settings.podiumThirdUsernameFontSize, 10),
        thirdUsernameColor: settings.podiumThirdUsernameColor,
        thirdAmountFontSize: parseInt(settings.podiumThirdAmountFontSize, 10),
        thirdAmountColor: settings.podiumThirdAmountColor,
        thirdStrokeWidth: parseFloat(settings.podiumThirdStrokeWidth),
        thirdStrokeColor: settings.podiumThirdStrokeColor,
      },
    },
  };
};