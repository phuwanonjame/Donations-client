"use client";

import { useFormContext } from "react-hook-form";
import { useState, useEffect } from "react";
import { Check, X } from "lucide-react";

const MAX_SELECT = 5;

const MOCK = [
  {
    id: "valorant",
    name: "VALORANT",
    image:
      "https://cdn.aona.co.th/u/nicenathapong/files/5be1c4094156fbe74d7049d417818b6c245291b569cd0dc5cfe80dd9e24d1336.png",
  },
  {
    id: "rov",
    name: "RoV",
    image:
      "https://play-lh.googleusercontent.com/2RrzGOcirTAU4vPzLiZ3Us4k-E-RtPVBbWB-RkU5FAT9gVrTlUJL0nYVN6VlpSbGq_uHHaLsvwvtxm1Mjirxpg",
  },
  {
    id: "minecraft",
    name: "Minecraft",
    image: "https://i.imgur.com/nKsYRdJ.png",
  },
  { id: "music", name: "Music & Singing" },
  { id: "vtuber", name: "VTuber" },
  { id: "irl", name: "IRL" },
];

export default function CategorySelector({ name = "categories", disabled }) {
  const { setValue, watch } = useFormContext();

  const formValue = watch(name) || [];
  const [selected, setSelected] = useState(formValue);

  useEffect(() => {
    setValue(name, selected, { shouldDirty: true });
  }, [selected, setValue, name]);

  const toggle = (id) => {
    if (disabled) return; 
    setSelected((prev) => {
      if (prev.includes(id)) {
        return prev.filter((i) => i !== id);
      }

      if (prev.length >= MAX_SELECT) return prev;

      return [...prev, id];
    });
  };

  const remove = (id) => {
    setSelected((prev) => prev.filter((i) => i !== id));
  };

  const selectedItems = MOCK.filter((i) => selected.includes(i.id));

  const Card = ({ item, isSelected, onClick, removable }) => (
    <div
      onClick={disabled ? undefined : onClick}
      className={`
        relative flex h-[90px] cursor-pointer gap-3 rounded-2xl border p-3
        transition duration-300 hover:scale-[1.02]
        ${
          isSelected
            ? "border-green-500 bg-green-500/10"
            : "border-white/20 bg-black/40"
        }
      `}
    >
      {item.image ? (
        <img
          src={item.image}
          className="aspect-square h-full rounded-xl object-cover"
        />
      ) : (
        <div className="flex aspect-square h-full items-center justify-center rounded-xl bg-gradient-to-br from-pink-500 to-rose-600 text-white font-bold">
          {item.name[0]}
        </div>
      )}

      <div className="flex flex-col justify-center text-left">
        <p className="font-bold text-white">{item.name}</p>
        <p className="text-xs text-white/60">หมวดหมู่</p>
      </div>

      {removable ? (
        <div
          onClick={(e) => {
            e.stopPropagation();
            if (disabled) return;
            remove(item.id);
          }}
          className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-500"
        >
          <X size={14} />
        </div>
      ) : isSelected ? (
        <div className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-green-500">
          <Check size={14} />
        </div>
      ) : null}
    </div>
  );

  return (
    <div className="grid grid-cols-1 gap-6 p-6 xl:grid-cols-2">
      {/* LEFT */}
      <div className="flex flex-col gap-4 rounded-3xl border border-white/20 p-6">
        <div>
          <h2 className="text-2xl font-semibold">ที่เลือกแล้ว</h2>
          <p className="text-sm text-white/60">
            {selected.length} / {MAX_SELECT}
          </p>
        </div>

        {selectedItems.length === 0 ? (
          <div className="py-10 text-center text-white/40">
            ยังไม่ได้เลือก
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {selectedItems.map((item) => (
              <Card
                key={item.id}
                item={item}
                isSelected={true}
                removable={true}
              />
            ))}
          </div>
        )}
      </div>

      {/* RIGHT */}
      <div className="flex flex-col gap-4 rounded-3xl border border-white/20 p-6">
        <div>
          <h2 className="text-2xl font-semibold">เลือกหมวดหมู่</h2>
          <p className="text-sm text-white/60">
            กดเพื่อเลือก / ยกเลิก
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {MOCK.map((item) => (
            <Card
              key={item.id}
              item={item}
              isSelected={selected.includes(item.id)}
              onClick={() => toggle(item.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}