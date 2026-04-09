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
  const year = parseInt(thaiYear) - 543;
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
        fontWeight: settings.titleFontWeight === 'bold' ? '700' : settings.titleFontWeight === 'medium' ? '500' : '400',
        fontSize: parseInt(settings.titleFontSize),
        color: settings.titleColor,
        strokeWidth: parseFloat(settings.titleStrokeWidth),
        strokeColor: settings.titleStrokeColor,
        alignment: settings.titleAlignment,
      },
      list: {
        count: settings.maxEntries,
        fontFamily: settings.listFontFamily,
        fontWeight: settings.listFontWeight === 'bold' ? '700' : settings.listFontWeight === 'medium' ? '500' : '400',
        fontSize: parseInt(settings.listFontSize),
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
        firstFontWeight: settings.podiumFirstFontWeight === 'bold' ? '700' : '500',
        firstStrokeWidth: parseFloat(settings.podiumFirstStrokeWidth),
        firstStrokeColor: settings.podiumFirstStrokeColor,
        firstShine: settings.podiumFirstShine,
        firstUsernameFontSize: parseInt(settings.podiumFirstUsernameFontSize),
        firstUsernameColor: settings.podiumFirstUsernameColor,
        firstAmountFontSize: parseInt(settings.podiumFirstAmountFontSize),
        firstAmountColor: settings.podiumFirstAmountColor,
        secondFontFamily: settings.podiumSecondFontFamily,
        secondFontWeight: settings.podiumSecondFontWeight === 'bold' ? '700' : '500',
        secondStrokeWidth: parseFloat(settings.podiumSecondStrokeWidth),
        secondStrokeColor: settings.podiumSecondStrokeColor,
        secondUsernameFontSize: parseInt(settings.podiumSecondUsernameFontSize),
        secondUsernameColor: settings.podiumSecondUsernameColor,
        secondAmountFontSize: parseInt(settings.podiumSecondAmountFontSize),
        secondAmountColor: settings.podiumSecondAmountColor,
      },
    },
  };
};