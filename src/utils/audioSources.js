export const SOUND_LIBRARY = [
  { id: "bb_spirit", name: "BB Spirit", path: "/sounds/bb_spirit.mp3", filename: "bb_spirit.mp3" },
  { id: "chime", name: "Chime", path: "/sounds/chime.mp3", filename: "chime.mp3" },
  { id: "cash", name: "Cash Register", path: "/sounds/cash_register.mp3", filename: "cash_register.mp3" },
  { id: "bell", name: "Bell Ring", path: "/sounds/bell_ring.mp3", filename: "bell_ring.mp3" },
  { id: "fanfare", name: "Fanfare", path: "/sounds/fanfare.mp3", filename: "fanfare.mp3" },
];

export const SOUND_SOURCES = Object.fromEntries(
  SOUND_LIBRARY.map(({ id, path }) => [id, path])
);

export const SOUND_OPTIONS = SOUND_LIBRARY.map(({ id, name }) => ({
  id,
  name,
}));
